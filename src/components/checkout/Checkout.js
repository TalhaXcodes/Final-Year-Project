import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/firestore/orderService";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();

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
  const total = subtotal + deliveryCharges;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setMessage("");

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

      await createOrder({
        userId: user?.uid || null,
        customer: form,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          category: item.category,
        })),
        subtotal,
        deliveryCharges,
        total,
      });
        clearCart();
      navigate("/thank-you");
    } catch (error) {
      console.error("Failed to place order:", error);
      setMessage(error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-rose-700 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <form
            onSubmit={handlePlaceOrder}
            className="lg:col-span-2 bg-white border border-rose-200 rounded-xl shadow p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Delivery Information
            </h2>

            {message && (
              <p className="text-rose-600 text-sm mb-4">{message}</p>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name *"
                className="border border-rose-200 p-3 rounded-md"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number *"
                className="border border-rose-200 p-3 rounded-md"
              />

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City *"
                className="border border-rose-200 p-3 rounded-md"
              />

              <input
                value="Cash on Delivery"
                disabled
                className="border border-rose-200 p-3 rounded-md bg-gray-50 text-gray-600"
              />

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Complete Address *"
                className="md:col-span-2 border border-rose-200 p-3 rounded-md min-h-28"
              />
            </div>

            <button
              disabled={placingOrder}
              className="w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 disabled:opacity-60 mt-6"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <div className="bg-white border border-rose-200 rounded-xl shadow p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Order Summary
            </h2>

            <div className="space-y-4 mb-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-white rounded-md border"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-rose-600 font-bold">
                      Rs {Number(item.price) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>Rs {subtotal}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Delivery</span>
              <span>Rs {deliveryCharges}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span className="text-rose-600">Rs {total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;