import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ThankYou = () => {
  const [show, setShow] = useState(false);

  const location = useLocation();
  const traitScores = location.state?.traitScores || {};

  const recommendations =
    location.state?.recommendations?.[0]?.recommendations?.[0]
      ?.recommendations || [];

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  const getGiftEmoji = (giftType) => {
    switch (giftType) {
      case "Perfume":
        return "🌸";
      case "Jewellery":
        return "💍";
      case "Clothing":
        return "👗";
      case "Shoes":
        return "👟";
      case "Edible Stuff":
        return "🍫";
      case "Fashion Accessories":
        return "👜";
      case "Toys":
        return "🧸";
      case "Makeup Products":
        return "💄";
      case "Accessories":
        return "✨";
      default:
        return "🎁";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-white px-4 py-10">
      <div
        className={`bg-white border border-rose-300 rounded-3xl shadow-2xl max-w-2xl w-full p-8 sm:p-10 transform transition-all duration-700
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center shadow-inner">
            <span className="text-5xl">🎁</span>
          </div>

          <h1 className="text-4xl font-bold text-rose-700 mb-4">
            Your Personalized Recommendations
          </h1>

          <p className="text-gray-600 leading-relaxed mb-10">
            Based on your personality, preferences, and recipient details,
            our AI-powered recommendation system selected these gift categories
            specially for you.
          </p>
        </div>

        {/* Trait Scores */}
        {Object.keys(traitScores).length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-rose-700 mb-5 text-center">
              Your Personality Trait Scores
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(traitScores).map(([trait, score]) => (
                <div
                  key={trait}
                  className="bg-rose-50 border border-rose-200 rounded-2xl p-4"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">
                      {trait.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-bold text-rose-600">
                      {score}%
                    </span>
                  </div>

                  <div className="w-full bg-rose-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-rose-500 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="space-y-5">
          {recommendations.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-rose-50 to-white border border-rose-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-2xl">
                    {getGiftEmoji(item.gift_type)}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-rose-700">
                      {item.gift_type}
                    </h2>

                    <p className="text-sm text-gray-500">
                      AI Recommendation #{index + 1}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-rose-600">
                    {(item.confidence * 100).toFixed(0)}%
                  </div>

                  <p className="text-xs text-gray-500">
                    Match Score
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-rose-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-rose-500 h-3 rounded-full transition-all duration-700"
                    style={{
                      width: `${(item.confidence * 100).toFixed(0)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105"
          >
            Back to Home
          </Link>

          <p className="text-sm text-gray-400 mt-6">
            © BASKETRIES — AI Powered Personalized Gifting Experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;