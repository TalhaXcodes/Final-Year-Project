import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Heart,
  Package,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Footer from "../Footer";
import { getUserOrders } from "../../services/firestore/orderService";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { favorites } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [loading, isAuthenticated, navigate, location]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) return;

      try {
        setOrdersLoading(true);
        const data = await getUserOrders(user.uid);
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <p className="text-rose-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-rose-50">
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="bg-white border border-rose-200 rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-900 mb-2">
            Welcome back, {displayName}!
          </h1>

          <p className="text-gray-600">
            Manage your recommendations, favorite gifts, and placed orders from
            one place.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link
            to="/questionnaire"
            className="bg-white border border-rose-300 rounded-xl shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-rose-600" />
            </div>

            <h2 className="text-xl font-bold text-rose-900 mb-2">
              Start AI Gift Finder
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Answer a short questionnaire and get personalized gift basket
              recommendations.
            </p>

            <span className="inline-flex items-center gap-2 text-rose-600 font-medium">
              Start Now
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/shop"
            className="bg-white border border-rose-300 rounded-xl shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-rose-600" />
            </div>

            <h2 className="text-xl font-bold text-rose-900 mb-2">
              Browse Gifts
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Explore available gift items and add your favorite products to the
              cart.
            </p>

            <span className="inline-flex items-center gap-2 text-rose-600 font-medium">
              Browse Shop
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/favourites"
            className="bg-white border border-rose-300 rounded-xl shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>

            <h2 className="text-xl font-bold text-rose-900 mb-2">
              My Favorites
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              View gifts you saved while browsing the Basketries collection.
            </p>

            <span className="inline-flex items-center gap-2 text-rose-600 font-medium">
              View Favorites
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>

            <div>
              <div className="text-2xl font-bold text-rose-900">
                {favorites.length}
              </div>
              <div className="text-sm text-gray-600">Saved Favorites</div>
            </div>
          </div>

          <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-rose-600" />
            </div>

            <div>
              <div className="text-2xl font-bold text-rose-900">
                {orders.length}
              </div>
              <div className="text-sm text-gray-600">Orders Placed</div>
            </div>
          </div>

          <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-rose-600" />
            </div>

            <div>
              <div className="text-2xl font-bold text-rose-900">
                {ordersLoading ? "..." : orders.length > 0 ? "Active" : "New"}
              </div>
              <div className="text-sm text-gray-600">Account Status</div>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-rose-900">
              Saved Favorites
            </h2>

            <Link
              to="/shop"
              className="text-rose-600 hover:text-rose-700 flex items-center gap-2"
            >
              Browse More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {favorites.length === 0 ? (
            <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-10 text-center">
              <Heart className="w-14 h-14 text-rose-300 mx-auto mb-4" />

              <h3 className="text-xl font-semibold text-rose-900 mb-2">
                No favorites yet
              </h3>

              <p className="text-gray-600 mb-6">
                Start adding gifts to your favorites to see them here.
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
              {favorites.slice(0, 3).map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white border border-rose-300 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="h-56 bg-rose-50 overflow-hidden">
                    <img
                      src={gift.imageUrl || gift.image}
                      alt={gift.name}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-rose-900 mb-2">
                      {gift.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-rose-900">
                        Rs {gift.price}
                      </span>

                      <Link
                        to={`/shop/${gift.id}`}
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
            <h2 className="text-2xl font-bold text-rose-900">My Orders</h2>
          </div>

          {ordersLoading ? (
            <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-10 text-center">
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-rose-300 rounded-xl shadow-sm p-10 text-center">
              <Package className="w-14 h-14 text-rose-300 mx-auto mb-4" />

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
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-800 break-all">
                        {order.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className="inline-block bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full capitalize">
                        {order.status || "pending"}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold text-rose-600">
                        Rs {order.total}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div
                        key={`${item.productId || item.id}-${index}`}
                        className="flex items-center gap-4 border border-rose-100 rounded-lg p-3"
                      >
                        <img
                          src={item.imageUrl || item.image}
                          alt={item.name}
                          className="w-20 h-20 object-contain bg-white rounded-md"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {item.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity || 1}
                          </p>
                        </div>

                        <p className="font-bold text-rose-600">
                          Rs {Number(item.price || 0) * Number(item.quantity || 1)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;