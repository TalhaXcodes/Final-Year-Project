import React, { useEffect, useState, useCallback } from "react";

const foodOptions = [
  "Chocolates",
  "Cupcakes",
  "Brownie",
  "Cake",
  "Snacks",
  "Jellies",
  "Popcorns",
  "Marshmellows",
  "Cola cans",
];

const foodFlavourOptions = {
  Chocolates: ["Dark Chocolate", "Milk Chocolate", "White Chocolate", "Hazelnut"],
  Brownie: ["Classic Fudge", "Walnut", "Red Velvet Brownie", "Peanut Butter"],
  Cake: ["Chocolate", "Red Velvet", "Vanilla", "Black Forest"],
  Cupcakes: ["Chocolate", "Vanilla", "Strawberry", "Lemon"],
  Snacks: ["Cheese", "Barbecue", "Sour Cream & Onion", "Spicy Chili"],
  Jellies: ["Strawberry", "Mango", "Orange", "Grape"],
  Popcorns: ["Butter", "Caramel", "Cheese", "Spicy"],
  Marshmellows: ["Classic Vanilla", "Strawberry", "Chocolate-coated", "Caramel-filled"],
  Cola: [] // no flavours
};

const EdibleGiftDetails = ({
  gift,
  recipientId,
  index,
  handleGiftSelection,
  setGiftValid,
}) => {
  const handleChange = useCallback(
    (field, value) => {
      handleGiftSelection(recipientId, index, field, value);
    },
    [handleGiftSelection, recipientId, index] // dependencies
  );


  const handleCheckboxChange = (item) => {
    const selected = gift.foodItems || [];
    const maxSelections = gift.edibleQuantity || 1;

    if (selected.includes(item)) {
      const updated = selected.filter((i) => i !== item);
      handleChange("foodItems", updated);
    } else if (selected.length < maxSelections) {
      const updated = [...selected, item];
      handleChange("foodItems", updated);
    }
  };

  const handleFlavourChange = (foodType, flavour) => {
    const updatedFlavours = { ...(gift.flavours || {}), [foodType]: flavour };
    handleChange("flavours", updatedFlavours);
  };




  const priceOptions = [
    "1000 PKR",
    "1000–2000 PKR",
    "3000–4000 PKR",
    "4000–5000 PKR",
    "5000–6000 PKR",
    "6000–7000 PKR",
  ];

  const getQuantityOptions = (price) => {
    switch (price) {
      case "1000 PKR":
        return [1, 2];
      case "1000–2000 PKR":
        return [1, 2];
      case "3000–4000 PKR":
        return [1, 2, 3, 4];
      case "4000–5000 PKR":
        return [1, 2, 3, 4, 5];
      case "5000–6000 PKR":
        return [1, 2, 3, 4, 5, 6];
      case "6000–7000 PKR":
        return [1, 2, 3, 4, 5, 6, 7, 8, 9];
      default:
        return [];
    }
  };

  const [isPriceSelected, setIsPriceSelected] = useState(!!gift.ediblePrice);

  useEffect(() => {
    setIsPriceSelected(!!gift.ediblePrice);
    if (gift.ediblePrice && (!gift.edibleQuantity || !getQuantityOptions(gift.ediblePrice).includes(gift.edibleQuantity))) {
      handleChange("edibleQuantity", getQuantityOptions(gift.ediblePrice)[0] || 1);
    }
  }, [gift.ediblePrice, gift.edibleQuantity, handleChange]);

  // Effect to unmark excess checkboxes when quantity changes
  useEffect(() => {
    const maxSelections = gift.edibleQuantity || 1;
    if (gift.foodItems && gift.foodItems.length > maxSelections) {
      const trimmedItems = gift.foodItems.slice(0, maxSelections);
      handleChange("foodItems", trimmedItems);
    }
  }, [gift.edibleQuantity, gift.foodItems, handleChange]);


  useEffect(() => {
    const isValid =
      gift.ediblePrice &&
      gift.edibleQuantity &&
      gift.foodItems?.length === gift.edibleQuantity &&
      gift.foodItems.every(
        (item) =>
          !foodFlavourOptions[item] || gift.flavours?.[item]
      );

    setGiftValid(index, isValid);
  }, [gift, index, setGiftValid]);


  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-rose-600 mb-4">
        Edible Preferences
      </h4>

      {/* 💰 Price */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Price</label>
        <div className="flex flex-col space-y-2">
          {priceOptions.map((price) => (
            <label key={price} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`ediblePrice-${recipientId}-${index}`}
                checked={gift.ediblePrice === price}
                onChange={() => handleChange("ediblePrice", price)}
              />
              <span className="text-gray-700">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 🔢 Quantity */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Quantity</label>
        <select
          value={gift.edibleQuantity || ""}
          onChange={(e) => handleChange("edibleQuantity", parseInt(e.target.value))}
          className="w-full border border-rose-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
          disabled={!isPriceSelected}
        >
          {!isPriceSelected && <option value="">Select a price first</option>}
          {isPriceSelected &&
            getQuantityOptions(gift.ediblePrice).map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
        </select>
      </div>

      {/* Food Selection */}
      <label className="block text-gray-700 font-medium mb-1">Food</label>

      {/* Guiding Note */}
      {gift.edibleQuantity && (
        <p
          className={`text-red-500 text-sm mb-2 transition-opacity duration-300 ${gift.foodItems?.length === gift.edibleQuantity ? "opacity-0" : "opacity-100"
            }`}
        >
          Please select exactly {gift.edibleQuantity} item
          {gift.edibleQuantity > 1 ? "s" : ""}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {foodOptions.map((item) => (
          <label key={item} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={gift.foodItems?.includes(item) || false}
              onChange={() => handleCheckboxChange(item)}
              disabled={!isPriceSelected}
            />
            <span className="text-gray-700">{item}</span>
          </label>
        ))}
      </div>


      {/* 🍫 Flavours for Selected Foods */}
      {gift.foodItems?.map(
        (item) =>
          foodFlavourOptions[item] &&
          foodFlavourOptions[item].length > 0 && (
            <div key={item} className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Flavour for {item}
              </label>
              <select
                value={gift.flavours?.[item] || ""}
                onChange={(e) => handleFlavourChange(item, e.target.value)}
                className="w-full border border-rose-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
                disabled={!isPriceSelected}
              >
                <option value="">Select a flavour</option>
                {foodFlavourOptions[item].map((flavour) => (
                  <option key={flavour} value={flavour}>
                    {flavour}
                  </option>
                ))}
              </select>
            </div>
          )
      )}
    </div>
  );
};

export default EdibleGiftDetails;