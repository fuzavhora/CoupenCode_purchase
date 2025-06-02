import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { useCart } from "../context/CardContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    axios.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const isInCart = cart.some((p) => p._id === product._id);

  return (
    <div className="max-w-3xl mx-auto p-4 flex gap-6">
      <img src={`${import.meta.env.VITE_IMAGE_UPLOAD_URL}/uploads/${product.image}`}
        alt={product.name} className="w-1/3 object-cover" />
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="mb-4">{product.description}</p>
        <p className="mb-4 text-xl font-semibold">₹{product.price}</p>
        <button
          disabled={isInCart}
          onClick={() => addToCart(product)}
          className={`px-4 py-2 rounded ${isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"
            }`}
        >
          {isInCart ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
