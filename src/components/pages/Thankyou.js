import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-xl shadow-md border border-rose-300 text-center max-w-lg w-full">
        <h1 className="text-4xl font-bold text-rose-700 mb-6">
          Thank You!
        </h1>
        <p className="text-gray-700 mb-8">
          Your responses have been successfully submitted. We appreciate your time and contribution!
        </p>
        <Link
          to="/"
          className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-md font-medium shadow-md transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
