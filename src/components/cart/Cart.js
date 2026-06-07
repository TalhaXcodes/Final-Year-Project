import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, Tag, X } from "lucide-react";
import { useState } from "react";

const Cart = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getCartTotal,
    discount,
    applyDiscountCode,
    removeDiscount,
    getDiscountAmount,
    getFinalCartTotal,
  } = useCart();

  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");

  const navigate = useNavigate();

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = getCartTotal();
  const discountAmount = getDiscountAmount();
  const finalTotal = getFinalCartTotal();

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountMessage("Please enter a discount code.");
      return;
    }

    const result = applyDiscountCode(discountCode);

    setDiscountMessage(result.message);

    if (result.success) {
      setDiscountCode("");
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
            Your Cart is Empty
          </h1>

          <p className="text-gray-600 mb-7">
            Add beautiful baskets and gifts to your cart before checkout.
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
            Shopping Cart
          </h1>

          <p className="text-gray-600 mt-2">
            Review your selected gifts before checkout.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item) => {
              const isPersonalized = item.type === "personalized";
              const imageSrc = item.imageUrl || item.images?.[0];

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl shadow-sm hover:shadow-md transition p-4 sm:p-5 ${isPersonalized
                    ? "border-2 border-rose-300"
                    : "border border-rose-100"
                    }`}
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {isPersonalized ? (
                      <div className="bg-gradient-to-br from-rose-50 to-white rounded-2xl w-full sm:w-36 h-36 flex items-center justify-center shrink-0 overflow-hidden">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={item.name}
                            className="w-full h-full object-contain p-3"
                          />
                        ) : (
                          <ShoppingBag className="w-10 h-10 text-rose-400" />
                        )}
                      </div>
                    ) : (
                      <Link
                        to={`/shop/${item.id}`}
                        className="bg-gradient-to-br from-rose-50 to-white rounded-2xl w-full sm:w-36 h-36 flex items-center justify-center shrink-0 overflow-hidden"
                      >
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={item.name}
                            className="w-full h-full object-contain p-3"
                          />
                        ) : (
                          <ShoppingBag className="w-10 h-10 text-rose-400" />
                        )}
                      </Link>
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-rose-500 font-semibold mb-1">
                            {isPersonalized
                              ? "Personalized Basket"
                              : item.category}
                          </p>

                          {isPersonalized ? (
                            <h2 className="text-lg font-bold text-gray-800">
                              {item.name}
                            </h2>
                          ) : (
                            <Link
                              to={`/shop/${item.id}`}
                              className="text-lg font-bold text-gray-800 hover:text-rose-600 transition"
                            >
                              {item.name}
                            </Link>
                          )}

                          <p className="text-sm text-gray-500 mt-1">
                            {isPersonalized
                              ? `${item.selectedCategory} Based Recommendation`
                              : item.category}
                          </p>

                          <p className="text-rose-600 font-bold mt-2">
                            Rs {Number(item.price).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {isPersonalized && item.selectedItems?.length > 0 && (
                        <div className="mt-5">
                          <h3 className="text-sm font-semibold text-rose-700 mb-2">
                            Selected Basket Items
                          </h3>

                          <div className="flex flex-wrap gap-2">
                            {item.selectedItems.map((basketItem, index) => {
                              const isBaseItem =
                                String(basketItem).trim().toLowerCase() ===
                                String(item.baseItem).trim().toLowerCase();

                              return (
                                <span
                                  key={index}
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${isBaseItem
                                    ? "bg-rose-100 text-rose-700 border-rose-300"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                    }`}
                                >
                                  {basketItem}
                                  {isBaseItem && " • Base"}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {isPersonalized && item.packagingChoice && (
                        <p className="text-sm text-gray-500 mt-3">
                          Packaging:{" "}
                          <span className="font-semibold text-rose-600">
                            {item.packagingChoice}
                          </span>
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                        <div className="inline-flex items-center border border-rose-200 rounded-xl overflow-hidden w-fit">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-10 h-10 flex items-center justify-center text-rose-600 hover:bg-rose-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="w-12 text-center font-semibold text-gray-800">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            disabled={item.quantity >= Number(item.stock || 0)}
                            className={`w-10 h-10 flex items-center justify-center ${item.quantity >= Number(item.stock || 0)
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-rose-600 hover:bg-rose-50"
                              }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-400">Item Total</p>
                          <p className="text-lg font-bold text-gray-800">
                            Rs{" "}
                            {(
                              Number(item.price) * item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-rose-100 rounded-3xl shadow-lg p-6 h-fit lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Order Summary
            </h2>

            <div className="space-y-4 mb-5">
              <div className="flex justify-between text-gray-600">
                <span>Total Items</span>
                <span className="font-semibold">{itemCount}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">
                  Rs {subtotal.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">
                    - Rs {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Apply Discount Code
                </p>

                {!discount ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-rose-500 absolute left-3 top-3.5" />
                      <input
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Enter code"
                        className="w-full border border-rose-200 pl-9 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="bg-rose-600 text-white px-4 rounded-xl text-sm hover:bg-rose-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white border border-rose-200 rounded-xl p-3">
                    <div>
                      <p className="text-sm font-semibold text-rose-700">
                        {discount.code}
                      </p>
                      <p className="text-xs text-gray-500">{discount.label}</p>
                    </div>

                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {discountMessage && (
                  <p className="text-xs text-gray-500 mt-2">
                    {discountMessage}
                  </p>
                )}
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-rose-100 pt-5 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-rose-600">
                  Rs {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-rose-600 text-white py-3 rounded-xl hover:bg-rose-700 transition font-medium"
            >
              Review Order
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