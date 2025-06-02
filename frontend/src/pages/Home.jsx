import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useCart } from "../context/CardContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get("/products")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleBuyNow = (product) => {
 
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-8 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Explore Our Coupons
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading Coupons...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No coupons found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            if (!p.couponCodes || p.couponCodes.length === 0) return null;

            return (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <div className="overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_IMAGE_UPLOAD_URL}/uploads/${p.image}`}

                    alt={p.name}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between h-[240px]">
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {p.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <p className="text-xl font-bold text-green-600 mb-3">
                      ${p.price}
                    </p>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleBuyNow(p)}
                        className="py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition duration-300"
                      >
                        Buy Now
                      </button>

                      <Link
                        to={`/products/${p._id}`}
                        className="py-2 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
