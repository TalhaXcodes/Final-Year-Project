import React, { useEffect } from "react";

const ShoeGiftDetails = ({
  gift,
  recipientId,
  index,
  handleGiftSelection,
  gender,
  ageType,
  setGiftValid,
}) => {

    useEffect(() => {
    const isValid =
      gift.shoePrice && gift.shoeSize && gift.shoeColor && gift.shoeStyle;
    setGiftValid(index, !!isValid);
  }, [gift, index, setGiftValid]);


  if (ageType !== "Adult") return null;
  const handleChange = (field, value) => {
    handleGiftSelection(recipientId, index, field, value);
  };

  const isMale = gender === "Male" && ageType === "Adult";
  const isFemale = gender === "Female" && ageType === "Adult";

  const priceOptions = [
    "5000 PKR",
    "5000–10,000 PKR",
    "10,000–15,000 PKR",
    "15,000–20,000 PKR",
    "20,000–25,000 PKR",
  ];

  const femaleSizes = ["37", "38", "39", "40", "41"];
  const femaleColors = ["Red", "Black", "Blue", "Green", "White"];
  const femaleStyles = [
    "Sandals",
    "Slippers",
    "Heels",
    "Sliders",
    "Formal shoes",
  ];

  const maleSizes = ["40", "41", "42", "43", "44", "45"];
  const maleColors = ["Light brown", "Black", "Brown"];
  const maleStyles = [
    "Sandals",
    "Loafers",
    "Formal shoes",
    "Slippers",
    "Peshawari style",
  ];



  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-rose-600 mb-4">
        Shoe Preferences
      </h4>

      {/* 💰 Price (common) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Price</label>
        <div className="flex flex-col space-y-2">
          {priceOptions.map((price) => (
            <label key={price} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`shoePrice-${recipientId}-${index}`}
                checked={gift.shoePrice === price}
                onChange={() => handleChange("shoePrice", price)}
              />
              <span className="text-gray-700">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 👩 Female Section */}
      {isFemale && (
        <>
          {/* Size */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Size</label>
            <select
              value={gift.shoeSize || ""}
              onChange={(e) => handleChange("shoeSize", e.target.value)}
              className="w-full border border-rose-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              <option value="">Select Size</option>
              {femaleSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Color</label>
            <div className="flex flex-col space-y-2">
              {femaleColors.map((color) => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`femaleShoeColor-${recipientId}-${index}`}
                    checked={gift.shoeColor === color}
                    onChange={() => handleChange("shoeColor", color)}
                  />
                  <span className="text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Style</label>
            <div className="flex flex-col space-y-2">
              {femaleStyles.map((style) => (
                <label key={style} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`femaleShoeStyle-${recipientId}-${index}`}
                    checked={gift.shoeStyle === style}
                    onChange={() => handleChange("shoeStyle", style)}
                  />
                  <span className="text-gray-700">{style}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 👨 Male Section */}
      {isMale && (
        <>
          {/* Size */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Size</label>
            <select
              value={gift.shoeSize || ""}
              onChange={(e) => handleChange("shoeSize", e.target.value)}
              className="w-full border border-rose-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              <option value="">Select Size</option>
              {maleSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Color</label>
            <div className="flex flex-col space-y-2">
              {maleColors.map((color) => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`maleShoeColor-${recipientId}-${index}`}
                    checked={gift.shoeColor === color}
                    onChange={() => handleChange("shoeColor", color)}
                  />
                  <span className="text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Style</label>
            <div className="flex flex-col space-y-2">
              {maleStyles.map((style) => (
                <label key={style} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`maleShoeStyle-${recipientId}-${index}`}
                    checked={gift.shoeStyle === style}
                    onChange={() => handleChange("shoeStyle", style)}
                  />
                  <span className="text-gray-700">{style}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoeGiftDetails;
