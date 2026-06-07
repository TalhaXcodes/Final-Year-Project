import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();

  const orderId = location.state?.orderId;
  const total = location.state?.total;
  const customerName = location.state?.customerName;

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lg border border-rose-100 p-8 text-center">

        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-14 h-14 text-green-600" />
        </div>

        <h1 className="text-4xl font-bold text-rose-700 mb-3">
          Order Confirmed 🎉
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you
          {customerName ? (
            <span className="font-semibold text-rose-600">
              {" "}{customerName}
            </span>
          ) : (
            ""
          )}
          ! Your order has been placed successfully.
        </p>

        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-8 text-left">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500">Order ID</span>
            <span className="font-bold text-gray-800 break-all">
              {orderId || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-t border-rose-100">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-semibold text-gray-800">
              Cash on Delivery
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-t border-rose-100">
            <span className="text-gray-500">Order Status</span>
            <span className="font-semibold text-yellow-600">
              Pending
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-t border-rose-100">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-bold text-rose-600">
              Rs {Number(total || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-t border-rose-100">
            <span className="text-gray-500">Confirmation Email</span>
            <span className="font-semibold text-gray-800">
              Pending
            </span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8">
          <p className="text-sm text-yellow-700">
            Please save your Order ID for future reference.
            Our team will contact you before delivery.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="bg-rose-600 text-white px-8 py-3 rounded-xl hover:bg-rose-700 transition"
          >
            Continue Shopping
          </Link>

          <Link
            to="/dashboard"
            className="border border-rose-300 text-rose-600 px-8 py-3 rounded-xl hover:bg-rose-50 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;