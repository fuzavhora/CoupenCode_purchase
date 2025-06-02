import React, { useState } from "react";
import { getAdminAuth, logoutAdmin } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin } = getAdminAuth();
  const token = localStorage.getItem("adminToken");
  if (!admin || !token) {
    navigate("/admin/login");
    return null; // Prevent rendering if not authenticated
  }

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    numberOfCoupen: "3",
  });
  const [imageFile, setImageFile] = useState(null);

  // Feedback state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("numberOfCoupen", formData.numberOfCoupen);
      if (imageFile) data.append("image", imageFile);

      // Send POST request with Authorization header
      const res = await axios.post("/admin/add-product", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message || "Product added successfully!");
      setFormData({ name: "", description: "", price: "", numberOfCoupen: "3" });
      setImageFile(null);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome, {admin?.username}
      </h1>
      <p>Email: {admin?.email}</p>
      <p>Role: {admin?.role}</p>
      <button
        onClick={handleLogout}
        className="mt-4 mb-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>

      <h2 className="text-xl font-semibold mb-3">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Number of Coupons</label>
          <input
            type="number"
            name="numberOfCoupen"
            min="1"
            max="10"
            value={formData.numberOfCoupen}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default AdminDashboard;
