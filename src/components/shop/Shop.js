import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "../../services/firestore/productService";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Eye,
  ShoppingCart,
  Search,
  Grid3X3,
  Gift,
  Flower2,
  SprayCan,
  Sparkles,
  Candy,
  Baby,
  Watch,
  Package,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

const categories = [
  { name: "All", icon: Grid3X3 },
  { name: "General Gift Baskets", icon: Gift },
  { name: "Flower Bouquets", icon: Flower2 },
  { name: "Perfume Sets", icon: SprayCan },
  { name: "Makeup Hampers", icon: Sparkles },
  { name: "Chocolate Gifts", icon: Candy },
  { name: "Baby Gifts", icon: Baby },
  { name: "Accessories", icon: Watch },
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const navigate = useNavigate();

  const { addToCart, addToFavorites, removeFromFavorites, favorites } =
    useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;

    return products.filter(
      (product) => product.category === selectedCategory
    );
  }, [products, selectedCategory]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const handleFavoriteToggle = (product, isFavourite) => {
    if (isFavourite) {
      removeFromFavorites(product.id);
      showToast("Removed from favourites");
    } else {
      addToFavorites(product);
      showToast("Added to favourites");
    }
  };

  const handleAddToCart = (product) => {
    if (Number(product.stock || 0) <= 0) {
      showToast("Product is out of stock");
      return;
    }

    addToCart(product);
    showToast("Added to cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
        <div className="bg-white border border-rose-200 rounded-2xl shadow-sm px-8 py-6 text-center">
          <Package className="w-10 h-10 text-rose-500 mx-auto mb-3 animate-pulse" />
          <p className="text-rose-700 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 px-4 sm:px-6 py-10">
      {toast && (
        <div className="fixed top-24 right-6 z-50 bg-rose-600 text-white px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-purple-50 border border-rose-200 rounded-[2rem] shadow-sm px-6 py-12 sm:px-10 mb-10 text-center">
          <div className="absolute -top-16 -left-16 w-52 h-52 bg-rose-300/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-16 w-60 h-60 bg-purple-300/30 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-rose-200 rounded-full px-4 py-2 shadow-sm mb-5">
              <ShoppingCart className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-medium text-rose-800">
                Basketries Collection
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-rose-950 mb-4">
              Shop Thoughtful Gifts
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse curated gift products and choose meaningful items for every
              occasion.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-white border border-rose-300 rounded-xl p-4 text-center mb-8">
            <p className="text-rose-600">{error}</p>
          </div>
        )}

        {/* Categories */}
        <div className="mb-10">
          <div className="bg-white/90 backdrop-blur-md border border-rose-200 rounded-3xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-rose-900">
                  Explore Categories
                </h2>
                <p className="text-sm text-gray-500">
                  Choose a category to filter available gifts.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-full px-4 py-2 w-fit">
                <Search className="w-4 h-4" />
                {filteredProducts.length} products found
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.name;

                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`group rounded-2xl border p-4 text-center transition-all duration-300
                      ${
                        isActive
                          ? "bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-200 scale-[1.02]"
                          : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50 hover:-translate-y-1 hover:shadow-md"
                      }`}
                  >
                    <div
                      className={`mx-auto mb-2 w-11 h-11 rounded-2xl flex items-center justify-center transition
                        ${isActive ? "bg-white/20" : "bg-rose-100 group-hover:bg-white"}`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-rose-600"
                        }`}
                      />
                    </div>

                    <span className="text-xs sm:text-sm font-semibold leading-tight">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-rose-300 rounded-2xl p-10 text-center shadow-sm">
            <Gift className="w-14 h-14 text-rose-300 mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-rose-700 mb-2">
              No products found
            </h2>

            <p className="text-gray-600">
              Products for this category are not available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((product) => {
              const isFavourite = favorites.some(
                (item) => item.id === product.id
              );

              const isOutOfStock = Number(product.stock || 0) <= 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl border border-rose-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div
                    onClick={() => navigate(`/shop/${product.id}`)}
                    className="relative bg-gradient-to-br from-rose-50 via-white to-pink-50 h-72 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isFeatured && (
                        <span className="bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                          Featured
                        </span>
                      )}

                      {isOutOfStock && (
                        <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(product, isFavourite);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-rose-100 transition"
                    >
                      <Heart
                        className={`w-5 h-5 text-rose-600 ${
                          isFavourite ? "fill-rose-600" : ""
                        }`}
                      />
                    </button>

                    <div className="absolute inset-x-0 bottom-4 px-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <div className="bg-white/95 backdrop-blur-md border border-rose-100 rounded-2xl shadow-lg p-3 flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/shop/${product.id}`);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-50 text-rose-700 py-2.5 rounded-xl hover:bg-rose-100 transition text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={isOutOfStock}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-600 text-white py-2.5 rounded-xl hover:bg-rose-700 transition text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-xs uppercase tracking-wide text-rose-500 font-semibold">
                        {product.category}
                      </p>

                      <p
                        className={`text-xs font-medium ${
                          isOutOfStock ? "text-gray-500" : "text-green-600"
                        }`}
                      >
                        {isOutOfStock
                          ? "Unavailable"
                          : `${product.stock || 0} in stock`}
                      </p>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">
                      {product.description || "A thoughtful gift item for special occasions."}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xl font-bold text-rose-600">
                        Rs {Number(product.price || 0).toLocaleString()}
                      </p>

                      <button
                        onClick={() => navigate(`/shop/${product.id}`)}
                        className="text-sm font-medium text-rose-600 hover:text-rose-700"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;