import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../services/firestore/productService";
import { useCart } from "../../context/CartContext";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToFavorites } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error(error);
        setMessage("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <p className="text-rose-600 font-medium">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <p className="text-rose-600">{message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow border border-rose-200 overflow-hidden grid md:grid-cols-2">
        <div className="bg-white p-6 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-h-[480px] object-contain"
          />
        </div>

        <div className="p-6 md:p-8">
          <p className="text-sm text-rose-600 font-medium mb-2">
            {product.category}
          </p>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {product.name}
          </h1>

          <p className="text-2xl font-bold text-rose-600 mb-4">
            Rs {product.price}
          </p>

          <p className="text-gray-600 mb-5">{product.description}</p>

          <div className="space-y-2 text-sm text-gray-700 mb-6">
            <p>
              <strong>Gender:</strong> {product.gender}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>
            <p>
              <strong>Age Groups:</strong>{" "}
              {Array.isArray(product.ageGroups)
                ? product.ageGroups.join(", ")
                : product.ageGroups}
            </p>
          </div>

          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="flex-1 bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 disabled:opacity-50"
            >
              Add to Cart
            </button>

            <button
              onClick={() => addToFavorites(product)}
              className="flex-1 border border-rose-400 text-rose-600 py-3 rounded-md hover:bg-rose-50"
            >
              Add to Favorites
            </button>
          </div>

          <button
            onClick={() => navigate("/shop")}
            className="mt-5 text-sm text-gray-500 hover:text-rose-600"
          >
            ← Back to Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;