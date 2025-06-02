import Order from "../models/order.model.js";

// Create order directly (if needed, not used in razorpay verify)
export const createOrder = async (req, res) => {
  const { products, totalAmount, paymentMethod, email } = req.body;
  try {
    const order = new Order({
      products,
      totalAmount,
      paymentMethod,
      paymentStatus: "Success",
      email,
    });
    await order.save();
    res.status(201).json({ msg: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ msg: "Failed to place order" });
  }
};

// Get orders by user email or id (adjust according to auth setup)
export const getUserOrders = async (req, res) => {
  try {
    // Assuming req.user exists with _id or email
    const email = req.user?.email || req.query.email;
    if (!email) return res.status(400).json({ msg: "User email required" });

    const orders = await Order.find({ email }).populate("products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
