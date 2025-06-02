import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CardContext";
import { toast } from "react-toastify";
import axios from "../api/axios";


export default function Checkout() {
  const { cart, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  console.log("Script : ", import.meta.env.PAYPAL_CLIENT_ID);


  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalAmount = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleCreateOrder = async () => {
    if (!isValidEmail(email)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      toast.error(msg);
      throw new Error(msg);
    }

    try {
      setLoading(true);
      const res = await axios.post("/payment/paypal-create-order", {
        amount: totalAmount,
        email,
        cart,
      });

      const orderId = res?.data?.id;
      if (!orderId) throw new Error("No order ID returned.");
      return orderId;
    } catch (err) {
      setError("Failed to create PayPal order. Please try again.");
      toast.error("Failed to create PayPal order.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderID, data) => {
    try {
      setLoading(true);
      const res = await axios.post("/payment/paypal-verify", {
        orderID: data.orderID,
        email,
        cart,
        totalAmount,
      });

      if (res.data.status === "success") {
        toast.success("Payment successful! Check your email.");
        clearCart();
        navigate("/thank-you");
      } else {
        setError("Payment verification failed");
        toast.error("Payment verification failed");
      }
    } catch (err) {
      console.error(err);
      setError("Error while verifying payment");
      toast.error("Error verifying payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
        Checkout
      </h2>

      {/* Email Input */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block mb-1 text-lg font-semibold text-gray-700"
        >
          Email for Confirmation:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="Enter your email"
          disabled={loading}
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-400"
            }`}
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-8">
          Your cart is empty.
        </p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {cart.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-4 border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <img
                  src={`${import.meta.env.VITE_IMAGE_UPLOAD_URL}/uploads/${item.image}`}

                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-sm font-medium text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  className="text-red-500 text-sm hover:underline"
                  onClick={() => removeFromCart(item._id)}
                  disabled={loading}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Total Summary */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-right mb-6">
            <p className="text-xl font-bold text-blue-800">
              Total: ${totalAmount}
            </p>
          </div>

          {/* PayPal Integration */}
          <div className="text-center">
            {loading && (
              <p className="mb-4 text-sm text-blue-500 animate-pulse">
                Processing... Please wait.
              </p>
            )}
            <PayPalScriptProvider
              options={{
                "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "fallback-client-id",
                currency: "USD",
                vault: true,
                intent: "capture",
              }}

            >
              <PayPalButtons
                style={{ layout: "vertical", label: "paypal" }}
                createOrder={() => handleCreateOrder()}
                onApprove={async (data) =>
                  await handleApprove(data.orderID, data)
                }
                onError={(err) => {
                  console.error(err);
                  toast.error("Payment failed. Try again.");
                  setError("Payment failed. Try again.");
                }}
                forceReRender={[email, totalAmount]}
                disabled={loading || !isValidEmail(email)}
              />
            </PayPalScriptProvider>
          </div>
        </>
      )}
    </div>
  );
}
