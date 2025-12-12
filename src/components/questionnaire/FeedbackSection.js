import React from "react";

const FeedbackSection = ({ feedbackData, setFeedbackData }) => {
  const handleChange = (e) => {
    setFeedbackData({
      ...feedbackData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 mt-8">
      <h2 className="text-2xl font-semibold text-rose-600 mb-6 text-center">
        Feedback
      </h2>

      {/* Question 1 */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Do you think this form will be able to help you find personalized gifts?
        </label>
        <div className="flex flex-col space-y-2">
          {["Yes", "No", "Maybe"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="helpful"
                value={option}
                checked={feedbackData.helpful === option}
                onChange={handleChange}
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 2 */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          What’s one important consideration that you think we overlooked in this questionnaire (to make it a personalized gift)?
        </label>
        <textarea
          name="suggestion"
          value={feedbackData.suggestion}
          onChange={handleChange}
          rows={4}
          placeholder="Your suggestion..."
          className="w-full border border-rose-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>
    </div>
  );
};

export default FeedbackSection;
