// controllers/paymentController.js

import axios from 'axios';
import dotenv from 'dotenv';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import nodemailer from 'nodemailer';

dotenv.config();

const PAYPAL_API = process.env.PAYPAL_API; // e.g., 'https://api-m.sandbox.paypal.com'
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Function to get PayPal access token
const getAccessToken = async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining PayPal access token:', error.response?.data || error.message);
    throw new Error('Failed to obtain PayPal access token');
  }
};

// Create PayPal Order
export const createPayPalOrder = async (req, res) => {
  const { amount, email, cart } = req.body;

  console.log('Creating PayPal order with:');
  

  if (!email || !amount || !cart || !Array.isArray(cart)) {

    return res.status(400).json({ error: 'Missing required fields: email, amount, or cart' });
  }

  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: Number(amount).toFixed(2),
            },
            description: `Order for ${email}`,
            custom_id: email,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({ id: response.data.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error.response?.data || error.message);
    res.status(500).json({ error: 'Unable to create PayPal order' });
  }
};

// Verify PayPal payment, create order, send coupon
export const verifyPaypalPayment = async (req, res) => {
  const { orderID, email, cart, totalAmount } = req.body;

  console.log("body" , req.body);
  

  if (!orderID || !email || !cart || !Array.isArray(cart) || !totalAmount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const accessToken = await getAccessToken();

    // Capture payment
    const captureResponse = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('Capture response:', captureResponse.data);
    

    if (
      !captureResponse.data ||
      !captureResponse.data.status ||
      captureResponse.data.status !== 'COMPLETED'
    ) {
      return res.status(400).json({ status: 'failure', error: 'Payment not successful' });
    }

    // Create order document
    const orderProducts = cart.map((item) => ({
      product: item._id,
      quantity: item.quantity,
    }));

    const order = new Order({
      products: orderProducts,
      totalAmount,
      paymentMethod: 'paypal',
      paymentStatus: 'Success',
      email,
      paypal_order_id: orderID,
      paypal_capture_id: captureResponse.data.id,
    });

    await order.save();

    // Create coupon list
    const couponDetails = [];

    for (const cartItem of cart) {
      const product = await Product.findById(cartItem._id);

      if (product?.couponCodes?.length > 0) {
        const couponCode = product.couponCodes[0];

        // Remove the coupon from product
        product.couponCodes = product.couponCodes.filter((c) => c !== couponCode);
        await product.save();

        couponDetails.push({
          productName: product.name,
          couponCode,
        });
      }
    }

    if (couponDetails.length === 0) {
      return res.json({
        status: 'success',
        message: 'Payment verified and order placed, but no coupons available',
      });
    }

    const couponText = couponDetails
      .map((item, index) => `${index + 1}. ${item.productName}: ${item.couponCode}`)
      .join('\n');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Your Coupon Codes',
      text: `Thank you for your purchase!\n\nHere are your coupon codes:\n\n${couponText}\n\nUse them on your next purchases!`,
    });

    return res.json({
      status: 'success',
      message: 'Payment verified, order placed, and coupons sent',
    });
  } catch (error) {
    console.error('PayPal post-payment error:', error.response?.data || error.message);
    return res.status(500).json({
      status: 'failure',
      error: 'Could not complete PayPal payment process',
    });
  }
};
