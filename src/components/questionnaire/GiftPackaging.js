import React from "react";

const GiftPackaging = ({ packagingChoice, setPackagingChoice }) => {
  const options = [
    "Basket with net",
    "Basket with ribbon",
    "Acrylic box",
    "Simple box",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 mt-8">
      <h2 className="text-2xl font-semibold text-rose-600 mb-4 text-center">
        Gift Packaging
      </h2>

      <div className="flex flex-col space-y-3">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="radio"
              name="packaging"
              value={option}
              checked={packagingChoice === option}
              onChange={() => setPackagingChoice(option)}
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default GiftPackaging;
