import { useEffect, useState, useCallback } from "react";

const JewelleryGiftDetails = ({
  gift,
  recipientId,
  index,
  handleGiftSelection,
  gender,
  ageType,
  setGiftValid
}) => {
  const handleChange = useCallback(
    (field, value) => {
      handleGiftSelection(recipientId, index, field, value);
    },
    [handleGiftSelection, recipientId, index] // stable dependencies
  );


  const isFemaleAdult = gender === "Female" && ageType === "Adult";
  const isMaleAdult = gender === "Male" && ageType === "Adult";

  const priceOptions = [
    "1000–2000 PKR",
    "2000–3000 PKR",
    "3000–4000 PKR",
    "4000–5000 PKR",
    "More than 5000 PKR",
  ];

  const getQuantityOptions = (price) => {
    switch (price) {
      case "1000–2000 PKR":
        return [1, 2];
      case "2000–3000 PKR":
        return [1, 2, 3];
      case "3000–4000 PKR":
        return [1, 2, 3, 4];
      case "4000–5000 PKR":
        return [1, 2, 3, 4, 5, 6];
      case "More than 5000 PKR":
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      default:
        return [];
    }
  };

  const [isPriceSelected, setIsPriceSelected] = useState(!!gift.jewelryPrice);

  useEffect(() => {
    setIsPriceSelected(!!gift.jewelryPrice);
    if (gift.jewelryPrice && (!gift.quantity || !getQuantityOptions(gift.jewelryPrice).includes(gift.quantity))) {
      handleChange("quantity", getQuantityOptions(gift.jewelryPrice)[0] || 1);
    }
  }, [gift.jewelryPrice, gift.quantity, handleChange]);


  useEffect(() => {
    const hasPrice = Boolean(gift.jewelryPrice);
    const hasQuantity = Boolean(gift.quantity);

    // 💎 Handle both "jewelryColors" (kids) and "jewelryColor" (adults)
    const colorField =
      gift.jewelryColors !== undefined ? gift.jewelryColors : gift.jewelryColor;

    const hasColor =
      typeof colorField === "string"
        ? colorField.trim() !== ""
        : Array.isArray(colorField)
          ? colorField.length > 0
          : false;

    const hasStyle =
      typeof gift.jewelryStyle === "string"
        ? gift.jewelryStyle.trim() !== ""
        : Array.isArray(gift.jewelryStyle)
          ? gift.jewelryStyle.length > 0
          : false;

    const isValid = hasPrice && hasQuantity && hasColor && hasStyle;

    console.log("Gift validation check:", {
      jewelryPrice: gift.jewelryPrice,
      quantity: gift.quantity,
      jewelryStyle: gift.jewelryStyle,
      jewelryColors: gift.jewelryColors,
      jewelryColor: gift.jewelryColor,
      isValid,
    });


    setGiftValid(index, isValid);
  }, [
    gift.jewelryPrice,
    gift.quantity,
    gift.jewelryStyle,
    gift.jewelryColor,
    gift.jewelryColors,
    index,
    setGiftValid,
  ]);

  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-rose-600 mb-4">
        Accessory Preferences
      </h4>

      {/* 💰 Price (shared) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Price</label>
        <div className="flex flex-col space-y-2">
          {priceOptions.map((price) => (
            <label key={price} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`jewelryPrice-${recipientId}-${index}`}
                checked={gift.jewelryPrice === price}
                onChange={() => handleChange("jewelryPrice", price)}
              />
              <span className="text-gray-700">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 📦 Quantity */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Quantity</label>
        <select
          value={gift.quantity || ""}
          onChange={(e) => handleChange("quantity", parseInt(e.target.value))}
          className="w-full border border-rose-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
          disabled={!isPriceSelected}
        >
          {!isPriceSelected && <option value="">Select a price first</option>}
          {isPriceSelected &&
            getQuantityOptions(gift.jewelryPrice).map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
        </select>
      </div>

      {/* 👨 Adult Male Options */}
      {isMaleAdult && (
        <>
          {/* Color */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Color</label>
            <div className="flex flex-col space-y-2">
              {["Silver", "Gold"].map((color) => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`jewelryColor-${recipientId}-${index}`}
                    checked={gift.jewelryColor === color}
                    onChange={() => handleChange("jewelryColor", color)}
                    disabled={!isPriceSelected}
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
              {["Bracelet", "Chain", "Rings", "Wrist bands"].map((style) => (
                <label key={style} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`jewelryStyle-${recipientId}-${index}`}
                    checked={gift.jewelryStyle === style}
                    onChange={() => handleChange("jewelryStyle", style)}
                    disabled={!isPriceSelected}
                  />
                  <span className="text-gray-700">{style}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 👩 Adult Female Options */}
      {isFemaleAdult && (
        <>
          {/* Color */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Color</label>
            <div className="flex flex-col space-y-2">
              {["Silver", "Gold"].map((color) => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`jewelryColor-${recipientId}-${index}`}
                    checked={gift.jewelryColor === color}
                    onChange={() => handleChange("jewelryColor", color)}
                    disabled={!isPriceSelected}
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
              {[
                "Necklace",
                "Earrings",
                "Rings",
                "Chokr",
                "Jhumkis",
                "Bracelet",
                "Pendant",
              ].map((style) => (
                <label key={style} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`jewelryStyle-${recipientId}-${index}`}
                    checked={gift.jewelryStyle === style}
                    onChange={() => handleChange("jewelryStyle", style)}
                    disabled={!isPriceSelected}
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

export default JewelleryGiftDetails;