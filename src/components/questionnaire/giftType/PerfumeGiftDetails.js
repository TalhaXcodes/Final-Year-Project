import React, { useEffect } from "react";

const PerfumeGiftDetails = ({
  gift,
  recipientId,
  index,
  handleGiftSelection,
  setGiftValid,
}) => {
  useEffect(() => {
    const isValid = gift.perfumePrice && gift.perfumeScent;
    setGiftValid(index, isValid);
  }, [gift, index, setGiftValid]);

  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-rose-600 mb-4">
        Perfume Preferences
      </h4>

      {/* 💰 Price Range */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          What is your budget for the perfume?
        </label>
        <div className="flex flex-col space-y-2">
          {["5000 PKR", "5000–7000 PKR", "7000–10,000 PKR", "10,000–12,000 PKR", "12,000–15,000 PKR"].map((price) => (
            <label key={price} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`perfumePrice-${recipientId}-${index}`}
                checked={gift.perfumePrice === price}
                onChange={() =>
                  handleGiftSelection(recipientId, index, "perfumePrice", price)
                }
              />
              <span className="text-gray-700">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 🌸 Scent */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Scent</label>
        <div className="flex flex-col space-y-2">
          {["Floral", "Spicy", "Sweet"].map((scent) => (
            <label key={scent} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`perfumeScent-${recipientId}-${index}`}
                checked={gift.perfumeScent === scent}
                onChange={() =>
                  handleGiftSelection(recipientId, index, "perfumeScent", scent)
                }
              />
              <span className="text-gray-700">{scent}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerfumeGiftDetails;
