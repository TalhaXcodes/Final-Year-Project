import React from "react";
import { AlertCircle } from "lucide-react";

const FeedbackSection = ({ feedbackData, setFeedbackData }) => {
  const handleChange = (e) => {
    setFeedbackData({
      ...feedbackData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Your Feedback
        </h2>
        <p className="text-gray-600 text-sm">Help us improve BASKETRIES with your insights</p>
      </div>

      {/* Question 1 */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          Do you think this form will help you find personalized gifts?
        </label>
        <div className="space-y-3">
          {["Yes, definitely", "Maybe", "Not sure"].map((option) => (
            <label key={option} className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50 cursor-pointer transition-all duration-300">
              <input
                type="radio"
                name="helpful"
                value={option}
                checked={feedbackData.helpful === option}
                onChange={handleChange}
                className="w-5 h-5 text-rose-600 cursor-pointer accent-rose-600"
              />
              <span className="text-gray-700 font-medium ml-3">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 2 */}
      <div className="mb-4">
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          What's one thing we could improve in this questionnaire?
        </label>
        <textarea
          name="suggestion"
          value={feedbackData.suggestion}
          onChange={handleChange}
          rows={5}
          placeholder="Share your suggestions to help us build better AI recommendations..."
          className="w-full border-2 border-gray-200 p-4 rounded-lg focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-300 resize-none placeholder:text-gray-400"
        />
        <p className="mt-2 text-xs text-gray-500">
          {feedbackData.suggestion.length}/500 characters
        </p>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">Your feedback is valuable and helps us improve our AI algorithms to provide better gift recommendations.</p>
      </div>
    </div>
  );
};

export default FeedbackSection;