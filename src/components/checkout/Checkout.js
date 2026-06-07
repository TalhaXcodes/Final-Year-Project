import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, MapPin, Phone, User, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/firestore/orderService";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    getCartTotal,
    clearCart,
    discount,
    getDiscountAmount,
    getFinalCartTotal,
  } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  const [message, setMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const deliveryCharges = 250;
  const subtotal = getCartTotal();
  const discountAmount = getDiscountAmount();
  const discountedSubtotal = getFinalCartTotal();
  const total = discountedSubtotal + deliveryCharges;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Please login or create an account to complete checkout.");
      return;
    }

    if (!form.fullName || !form.phone || !form.address || !form.city) {
      setMessage("Please fill all required fields.");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderId = await createOrder({
        userId: user.uid,
        customer: form,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          imageUrl: item.imageUrl || item.images?.[0] || "",
          category: item.category,

          type: item.type || "regular",
          basePrice: item.basePrice || null,
          addonTotal: item.addonTotal || 0,

          selectedCategory: item.selectedCategory || null,
          selectedItems: item.selectedItems || [],
          baseItem: item.baseItem || null,
          packagingChoice: item.packagingChoice || null,
        })),
        subtotal,
        discount: discount || null,
        discountAmount,
        deliveryCharges,
        total,
        payment: {
          method: "Cash on Delivery",
          status: "Pending",
          transactionId: null,
        },

        orderStatus: "Pending",
      });

      clearCart();
      navigate("/order-success", {
        state: {
          orderId,
          total,
          customerName: form.fullName,
          emailSent: false,
        },
      });
    } catch (error) {
      console.error("Failed to place order:", error);
      setMessage(error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-rose-50 px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white border border-rose-100 rounded-3xl shadow-lg p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-rose-100 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-rose-600" />
          </div>

          <h1 className="text-3xl font-bold text-rose-700 mb-3">
            Your cart is empty
          </h1>

          <p className="text-gray-600 mb-7">
            Add some beautiful gifts before proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="inline-block bg-rose-600 text-white px-7 py-3 rounded-xl hover:bg-rose-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-rose-700">
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">
            Confirm your delivery details and place your order.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <form
            onSubmit={handlePlaceOrder}
            className="lg:col-span-2 bg-white border border-rose-100 rounded-3xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Delivery Information
            </h2>

            {message && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl p-3 mb-5">
                {message}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="w-5 h-5 text-rose-500 absolute left-3 top-3.5" />
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  className="w-full border border-rose-200 pl-11 p-3 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
                />
              </div>

              <div className="relative">
                <Phone className="w-5 h-5 text-rose-500 absolute left-3 top-3.5" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number *"
                  className="w-full border border-rose-200 pl-11 p-3 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
                />
              </div>

              <div className="relative">
                <MapPin className="w-5 h-5 text-rose-500 absolute left-3 top-3.5" />
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City *"
                  className="w-full border border-rose-200 pl-11 p-3 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
                />
              </div>

              <div className="relative">
                <CreditCard className="w-5 h-5 text-rose-500 absolute left-3 top-3.5" />
                <input
                  value="Cash on Delivery"
                  disabled
                  className="w-full border border-rose-200 pl-11 p-3 rounded-xl bg-gray-50 text-gray-600"
                />
              </div>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Complete Address *"
                className="md:col-span-2 border border-rose-200 p-3 rounded-xl min-h-32 focus:ring-2 focus:ring-rose-300 outline-none"
              />
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mt-6">
              <p className="text-sm font-semibold text-gray-800">
                Payment Method: Cash on Delivery
              </p>
              <p className="text-sm text-gray-500 mt-1">
                You will pay when your gift order is delivered.
              </p>
            </div>

            {!user ? (
              <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4 mt-6 text-center">
                <p className="text-yellow-700 text-sm font-medium mb-3">
                  Please login or create an account to complete checkout.
                </p>

                <Link
                  to="/login"
                  className="inline-block bg-rose-600 text-white px-6 py-3 rounded-xl hover:bg-rose-700 transition font-medium"
                >
                  Login to Checkout
                </Link>
              </div>
            ) : (
              <button
                disabled={placingOrder}
                className="w-full bg-rose-600 text-white py-3 rounded-xl hover:bg-rose-700 disabled:opacity-60 mt-6 font-medium transition"
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            )}
          </form>

          <div className="bg-white border border-rose-100 rounded-3xl shadow-lg p-6 h-fit lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Order Summary
            </h2>

            <div className="space-y-4 mb-5 max-h-[360px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border border-rose-100 rounded-2xl p-3"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-white rounded-xl"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {item.name}
                    </p>
                    {item.type === "personalized" && item.selectedItems?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Items: {item.selectedItems.join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-rose-600 font-bold">
                      Rs{" "}
                      {(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-rose-100 pt-5 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {discount?.code && `(${discount.code})`}</span>
                  <span>- Rs {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>Rs {deliveryCharges.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-bold text-lg pt-3 border-t border-rose-100">
                <span>Total</span>
                <span className="text-rose-600">
                  Rs {total.toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              to="/cart"
              className="block text-center mt-5 text-sm text-gray-500 hover:text-rose-600"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;