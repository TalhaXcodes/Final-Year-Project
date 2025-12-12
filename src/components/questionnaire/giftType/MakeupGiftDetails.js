import React, { useEffect } from "react";

const MakeupGiftDetails = ({ gift, recipientId, index, handleGiftSelection, setGiftValid }) => {
  useEffect(() => {
    let isValid = false;

    // ✅ Makeup is valid if both price and item are selected
    if (gift.makeupPrice && gift.makeupItem) {
      isValid = true;
    }

    setGiftValid(index, isValid);
  }, [gift, index, setGiftValid]);


  const handleChange = (field, value) => {
    handleGiftSelection(recipientId, index, field, value);
  };

  const priceOptions = [
    "1000–3000 PKR",
    "3000–4000 PKR",
    "4000–5000 PKR",
    "5000–6000 PKR",
    "6000–7000 PKR",
    "7000–8000 PKR",
    "8000–9000 PKR",
    "9000–10,000 PKR",
    "10,000–15,000 PKR",
  ];

  const makeupItems = [
    "Eyeshadow kit",
    "Eyebrow kit",
    "Foundation",
    "Concealer",
    "Lip gloss",
    "Vinyl lipstick",
    "Highlighter",
    "Face powder",
    "Cake powder",
    "Mascara",
    "Eye liner",
    "Lip liner",
    "Cheek blush",
    "Eye brushes palette",
    "Different brushes palette",
    "Face Mask (skincare)",
  ];

  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-rose-600 mb-4">
        Makeup Preferences
      </h4>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Price
        </label>
        <div className="flex flex-col space-y-2">
          {priceOptions.map((price) => (
            <label key={price} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`makeupPrice-${recipientId}-${index}`}
                checked={gift.makeupPrice === price}
                onChange={() => handleChange("makeupPrice", price)}
              />
              <span className="text-gray-700">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* What do you want to add */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          What do you want to add? (Select only one)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {makeupItems.map((item) => (
            <label key={item} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`makeupItem-${recipientId}-${index}`}   // 👈 ensures only one can be selected
                checked={gift.makeupItem === item}
                onChange={() => handleChange("makeupItem", item)}   // 👈 update state with single selection
              />
              <span className="text-gray-700">{item}</span>
            </label>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MakeupGiftDetails;
