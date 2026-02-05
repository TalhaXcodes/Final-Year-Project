import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-rose-50 px-4">
      
      {/* Center Card */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-rose-300 w-full max-w-md text-center">
          
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-600 mb-4">
            Welcome to BASKETRIES
          </h1>

          <p className="text-gray-700 mb-6 text-sm sm:text-base">
            Find personalized gift recommendations powered by AI.
          </p>

          {/* Buttons Row */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="flex-1 border border-rose-600 text-rose-600 py-2 rounded-md hover:bg-rose-50 transition"
            >
              Register
            </button>
          </div>

          {/* Why Basketries */}
          <div className="border-t border-rose-200 pt-4">
            <h2 className="text-lg font-semibold text-rose-600 mb-2">
              Why BASKETRIES?
            </h2>
            <p className="text-gray-600 text-sm">
              BASKETRIES helps you choose meaningful gifts by analyzing user
              preferences and recommending items that truly match the
              recipient’s personality, making every gift special.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mb-4">
        © 2026 BASKETRIES. All rights reserved.
      </footer>

    </div>
  );
};

export default LandingPage;
