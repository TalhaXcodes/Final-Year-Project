import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getCartTotal,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-rose-50 px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white border border-rose-200 rounded-xl shadow p-10 text-center">
          <h1 className="text-3xl font-bold text-rose-700 mb-3">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-6">
            Add some gifts to your cart before checkout.
          </p>

          <Link
            to="/shop"
            className="inline-block bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700"
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
        <h1 className="text-3xl font-bold text-rose-700 mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-rose-200 rounded-xl shadow p-4 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full sm:w-32 h-32 object-contain bg-white rounded-md"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500">{item.category}</p>

                  <p className="text-rose-600 font-bold mt-2">
                    Rs {item.price}
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-8 h-8 rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50"
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-8 h-8 rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-rose-200 rounded-xl shadow p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between text-gray-600 mb-3">
              <span>Items</span>
              <span>
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 mb-3">
              <span>Subtotal</span>
              <span>Rs {getCartTotal()}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-4">
              <span>Delivery</span>
              <span>Calculated later</span>
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-rose-600">Rs {getCartTotal()}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/shop"
              className="block text-center mt-4 text-sm text-gray-500 hover:text-rose-600"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;