import React, { useEffect, useCallback, useState } from "react";

const foodFlavourOptions = {
  Chocolates: ["Dark Chocolate", "Milk Chocolate", "White Chocolate", "Hazelnut"],
  Brownie: ["Classic Fudge", "Walnut", "Red Velvet Brownie", "Peanut Butter"],
  Cake: ["Chocolate", "Red Velvet", "Vanilla", "Black Forest"],
  Cupcakes: ["Chocolate", "Vanilla", "Strawberry", "Lemon"],
  Snacks: ["Cheese", "Barbecue", "Sour Cream & Onion", "Spicy Chili"],
  Jellies: ["Strawberry", "Mango", "Orange", "Grape"],
  Popcorns: ["Butter", "Caramel", "Cheese", "Spicy"],
  Marshmellows: ["Classic Vanilla", "Strawberry", "Chocolate-coated", "Caramel-filled"],
  Cola: [],
};

const KidGiftDetails = ({
  gift,
  recipientId,
  index,
  handleGiftSelection,
  setGiftValid,
}) => {
  const selectedType = gift.type;

  const handleChange = useCallback(
    (field, value) => {
      handleGiftSelection(recipientId, index, field, value);
    },
    [handleGiftSelection, recipientId, index]
  );

  // --- 🍫 Edible Stuff Data ---
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

  const foodOptions = [
    "Chocolates",
    "Brownie",
    "Cake",
    "Cupcakes",
    "Snacks",
    "Jellies",
    "Popcorns",
    "Marshmellows",
    "Cola cans",
  ];

  const [isPriceSelected, setIsPriceSelected] = useState(!!gift.ediblePrice);

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


  // --- 🧸 Toys Data ---
  const toyBudgetOptions = [
    "3500 PKR",
    "3500 – 5500 PKR",
    "5500 – 7500 PKR",
    "More than 7500 PKR",
  ];

  // --- 👃 Perfume Data ---
  const perfumeBudgetOptions = [
    "1000–1500 PKR",
    "1500–2000 PKR",
    "2000–2500 PKR",
    "2500–3000 PKR",
  ];

  const perfumeScentOptions = ["Floral", "Fruity", "Citrus", "Woody"];

  // 💍 Accessories Options
  const accessoryStyles = [
    "Chain",
    "Rings",
    "Bracelets",
    "Bangles",
    "Scrunchies",
    "Wrist bands",
    "Bow style hairband",
  ];

  const accessoryColors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "White",
    "Black",
    "Purple",
  ];


  // --- 🧠 Validation Hook ---
  useEffect(() => {
    let isValid = false;

    if (selectedType === "Toys") {
      isValid = !!gift.kidBudget;
    } else if (selectedType === "Perfume") {
      isValid = gift.perfumeBudget && gift.perfumeScent;
    } else if (selectedType === "Edible Stuff") {
      isValid =
        gift.ediblePrice &&
        gift.edibleQuantity &&
        gift.foodItems?.length === gift.edibleQuantity &&
        gift.foodItems.every(
          (item) =>
            !foodFlavourOptions[item] || gift.flavours?.[item]
        );
    } else if (selectedType === "Accessories") {
      isValid =
        gift.jewelryPrice &&
        gift.quantity &&
        gift.jewelryStyle &&
        gift.jewelryColors;
    }

    setGiftValid(index, isValid);
  }, [gift, selectedType, index, setGiftValid]);

  // --- 🏗️ Render ---
  return (
    <div className="mb-4">
      {/* 🧸 Toys Section */}
      {selectedType === "Toys" && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-rose-600 mb-4">Toy Preferences</h4>
          <label className="block text-gray-700 font-medium mb-1">
            What is your budget for the gift?
          </label>
          <div className="flex flex-col space-y-2">
            {toyBudgetOptions.map((price) => (
              <label key={price} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`kidBudget-${recipientId}-${index}`}
                  checked={gift.kidBudget === price}
                  onChange={() => handleChange("kidBudget", price)}
                />
                <span className="text-gray-700">{price}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 👃 Perfume Section */}
      {selectedType === "Perfume" && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-rose-600 mb-4">Perfume Preferences</h4>
          <label className="block text-gray-700 font-medium mb-1">
            What is your budget for the perfume?
          </label>
          <div className="flex flex-col space-y-2 mb-4">
            {perfumeBudgetOptions.map((price) => (
              <label key={price} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`perfumeBudget-${recipientId}-${index}`}
                  checked={gift.perfumeBudget === price}
                  onChange={() => handleChange("perfumeBudget", price)}
                />
                <span className="text-gray-700">{price}</span>
              </label>
            ))}
          </div>

          <label className="block text-gray-700 font-medium mb-1">
            Does the child have a preferred scent?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {perfumeScentOptions.map((scent) => (
              <label key={scent} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`perfumeScent-${recipientId}-${index}`}
                  checked={gift.perfumeScent === scent}
                  onChange={() => handleChange("perfumeScent", scent)}
                />
                <span className="text-gray-700">{scent}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 🍫 Edible Stuff Section */}
      {selectedType === "Edible Stuff" && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-rose-600 mb-4">Edible Preferences</h4>

          {/* Price */}
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <div className="flex flex-col space-y-2 mb-4">
            {priceOptions.map((price) => (
              <label key={price} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`ediblePrice-${recipientId}-${index}`}
                  checked={gift.ediblePrice === price}
                  onChange={() => {
                    handleChange("ediblePrice", price);
                    handleChange("edibleQuantity", 1);
                    setIsPriceSelected(true);
                  }}
                />
                <span className="text-gray-700">{price}</span>
              </label>
            ))}
          </div>

          {/* Quantity */}
          <label className="block text-gray-700 font-medium mb-1">Quantity</label>
          <select
            value={gift.edibleQuantity || ""}
            onChange={(e) =>
              handleChange("edibleQuantity", parseInt(e.target.value))
            }
            className="w-full border border-rose-300 p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400"
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


          {/* Flavour Selection */}
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
                    onChange={(e) =>
                      handleFlavourChange(item, e.target.value)
                    }
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
      )}

      {/* 💍 Accessories Section */}
      {selectedType === "Accessories" && (
        <>
          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Price</label>
            <div className="flex flex-col space-y-2">
              {["1000–2000 PKR", "2000–3000 PKR", "3000–4000 PKR", "4000–5000 PKR", "More than 5000 PKR"].map((price) => (
                <label key={price} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`jewelryPrice-${recipientId}-${index}`}
                    checked={gift.jewelryPrice === price}
                    onChange={() => {
                      handleChange("jewelryPrice", price);
                      handleChange("quantity", 1); // ✅ auto-set default quantity
                    }}
                  />
                  <span className="text-gray-700">{price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Quantity</label>
            <select
              value={gift.quantity || ""}
              onChange={(e) => handleChange("quantity", parseInt(e.target.value))}
              className="w-full border border-rose-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
              disabled={!gift.jewelryPrice}
            >
              {!gift.jewelryPrice && <option value="">Select a price first</option>}
              {gift.jewelryPrice &&
                (function () {
                  switch (gift.jewelryPrice) {
                    case "1000–2000 PKR": return [1, 2];
                    case "2000–3000 PKR": return [1, 2, 3];
                    case "3000–4000 PKR": return [1, 2, 3, 4];
                    case "4000–5000 PKR": return [1, 2, 3, 4, 5, 6];
                    case "More than 5000 PKR": return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    default: return [];
                  }
                })().map(qty => <option key={qty} value={qty}>{qty}</option>)
              }
            </select>
          </div>

          {/* Style */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Style</label>
            <div className="flex flex-col space-y-2">
              {accessoryStyles.map((style) => (
                <label key={style} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`jewelryStyle-${recipientId}-${index}`}
                    checked={gift.jewelryStyle === style}
                    onChange={() => handleChange("jewelryStyle", style)}
                    disabled={!gift.jewelryPrice}
                  />
                  <span className="text-gray-700">{style}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Color</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {accessoryColors.map((color) => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`jewelryColors-${recipientId}-${index}`}
                    checked={gift.jewelryColors === color}
                    onChange={() => handleChange("jewelryColors", color)}
                    disabled={!gift.jewelryPrice}
                  />
                  <span className="text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KidGiftDetails;
