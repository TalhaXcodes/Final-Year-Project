import { useEffect, useState } from "react";
import { Heart, ShoppingCart, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../services/firestore/productService";
import { useCart } from "../../context/CartContext";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
    addToFavorites,
    removeFromFavorites,
    favorites,
  } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

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

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2000);
  };

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

  const isFavourite = favorites.some((item) => item.id === product.id);

  return (
    <div className="min-h-screen bg-rose-50 px-4 py-10">
      {toast && (
        <div className="fixed top-24 right-6 z-50 bg-rose-600 text-white px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-rose-100 overflow-hidden grid md:grid-cols-2">
          <div className="relative bg-gradient-to-br from-rose-50 to-white p-8 flex items-center justify-center min-h-[460px]">
            {product.isFeatured && (
              <span className="absolute top-6 left-6 bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow">
                Featured
              </span>
            )}

            {product.stock <= 0 && (
              <span className="absolute top-6 right-6 bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow">
                Out of Stock
              </span>
            )}

            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-h-[430px] object-contain drop-shadow-sm"
            />
          </div>

          <div className="p-6 md:p-10 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-wide text-rose-500 font-semibold mb-2">
              {product.category}
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-rose-600 mb-5">
              Rs {Number(product.price).toLocaleString()}
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-7">
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Availability</p>
                <p
                  className={`font-semibold ${
                    product.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Stock</p>
                <p className="font-semibold text-gray-800">
                  {product.stock} available
                </p>
              </div>
            </div>

            <div className="bg-white border border-rose-100 rounded-2xl p-4 mb-7">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-rose-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">
                    Perfect for gifting
                  </p>
                  <p className="text-sm text-gray-500">
                    Carefully selected and beautifully presented for special moments.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  addToCart(product);
                  showToast("Product added to cart");
                }}
                disabled={product.stock <= 0}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-600 text-white py-3 rounded-xl hover:bg-rose-700 disabled:opacity-50 transition"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                onClick={() => {
                  if (isFavourite) {
                    removeFromFavorites(product.id);
                    showToast("Removed from favourites");
                  } else {
                    addToFavorites(product);
                    showToast("Added to favourites");
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-rose-300 text-rose-600 py-3 rounded-xl hover:bg-rose-50 transition"
              >
                <Heart
                  className={`w-5 h-5 ${isFavourite ? "fill-rose-600" : ""}`}
                />
                {isFavourite ? "Remove Favourite" : "Add Favourite"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;