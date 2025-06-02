// src/pages/ThankYou.jsx
import { Link } from "react-router-dom";

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-6">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Thank You for Your Purchase!</h1>
      <p className="text-gray-700 text-lg mb-6">A confirmation email has been sent to your inbox.</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
