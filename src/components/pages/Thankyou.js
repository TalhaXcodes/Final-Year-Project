import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ThankYou = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-white px-4">
      <div
        className={`bg-white border border-rose-300 rounded-2xl shadow-xl max-w-lg w-full p-10 text-center transform transition-all duration-700
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        {/* Decorative circle */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center">
          <span className="text-4xl">🎁</span>
        </div>

        <h1 className="text-4xl font-bold text-rose-700 mb-4">
          Thank You!
        </h1>

        <p className="text-gray-700 mb-8 leading-relaxed">
          Your response has been successfully recorded.  
          We truly appreciate your time and contribution to our research.
        </p>

        <Link
          to="/"
          className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-md font-semibold shadow-md transition transform hover:scale-105"
        >
          Back to Home
        </Link>

        <p className="text-sm text-gray-400 mt-6">
          © BASKETRIES — Personalized Gifting Experience
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
