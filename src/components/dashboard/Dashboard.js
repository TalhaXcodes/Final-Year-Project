import React, { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Heart, Package, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { mockRecommendations } from "../../data/recommendations";
import Footer from "../Footer";
import { useState } from "react";
import { getUserOrders } from "../../services/firestore/orderService";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { favorites } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { state: { from: location } });
    }
  }, [loading, isAuthenticated, navigate, location]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) return;

      try {
        const data = await getUserOrders(user.uid);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }



  const displayName = user?.displayName || user?.name || "User";

  return (
    <div className="min-h-screen bg-rose-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-rose-900 mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-600">
            Manage your saved favorites and view past recommendations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-900">{favorites.length}</div>
              <div className="text-sm text-gray-600">Saved Favorites</div>
            </div>
          </div>

          <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-900">0</div>
              <div className="text-sm text-gray-600">Orders Placed</div>
            </div>
          </div>

          <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-900">1</div>
              <div className="text-sm text-gray-600">AI Sessions</div>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-rose-900">Saved Favorites</h2>
            <Link
              to="/shop"
              className="text-rose-600 hover:text-rose-700 flex items-center gap-2"
            >
              Browse More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {favorites.length === 0 ? (
            <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-12 text-center">
              <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-rose-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start adding gifts to your favorites to see them here
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl hover:bg-rose-700 transition-colors"
              >
                Browse Gifts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white border border-rose-300 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={gift.image}
                      alt={gift.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-rose-900 mb-2">{gift.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-rose-900">Rs {gift.price}</span>
                      <Link
                        to={`/product/${gift.id}`}
                        className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-rose-900">
              My Orders
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-10 text-center">
              <h3 className="text-xl font-semibold text-rose-900 mb-2">
                No orders yet
              </h3>

              <p className="text-gray-600 mb-6">
                Your placed orders will appear here.
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl hover:bg-rose-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-rose-300 rounded-xl shadow-sm p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="font-semibold text-gray-800">
                        {order.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Status
                      </p>

                      <span className="inline-block bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full capitalize">
                        {order.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <p className="font-bold text-rose-600">
                        Rs {order.total}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4 border rounded-lg p-3"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-contain bg-white rounded-md"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {item.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="font-bold text-rose-600">
                          Rs {item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Previous Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-rose-900">Previous Recommendations</h2>
            <Link
              to="/recommendations"
              className="text-rose-600 hover:text-rose-700 flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockRecommendations.slice(0, 3).map((gift) => (
              <div
                key={gift.id}
                className="bg-white border border-rose-300 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md border border-rose-200">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-rose-600" />
                      <span className="text-sm font-semibold text-rose-900">
                        {gift.matchScore}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-rose-900 mb-2">{gift.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-rose-900">Rs {gift.price}</span>
                    <Link
                      to={`/product/${gift.id}`}
                      className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;