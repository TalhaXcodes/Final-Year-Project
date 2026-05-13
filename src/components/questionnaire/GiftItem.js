import React from "react";
import MakeupGiftDetails from "./giftType/MakeupGiftDetails";
import WalletGiftDetails from "./giftType/WalletGiftDetails";
import JewelleryGiftDetails from "./giftType/JewelleryGiftDetails";
import PerfumeGiftDetails from "./giftType/PerfumeGiftDetails";
import EdibleGiftDetails from "./giftType/EdibleGiftDetails";
import ShoeGiftDetails from "./giftType/ShoeGiftDetails";
import ClothingGiftDetails from "./giftType/ClothingGiftDetails";
import KidGiftDetails from "./giftType/KidGiftDetails";
import { GLOBAL_BUDGET_OPTIONS } from "./Questionnaire";

const GiftItem = ({
  gift,
  recipientId,
  index,
  handleGiftSelection,
  giftOptions,
  ageType,
  gender,
  setGiftValid,
}) => {
  let finalGiftOptions = [];

  // If recipient is a Kid → Options handled in KidGiftDetails
  if (ageType === "Kid") {
    finalGiftOptions = ["Perfume", "Edible Stuff", "Toys", "Accessories"];
  } else {
    // If recipient is Adult → Build full list based on gender
    finalGiftOptions = [...giftOptions];
  }

  // Ensure gift.type is valid
  if (gift.type && !finalGiftOptions.includes(gift.type)) {
    handleGiftSelection(recipientId, index, "type", "");
  }

  const uniqueGiftOptions = [...new Set(finalGiftOptions)];

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">

      <h3 className="text-lg font-semibold text-rose-600 mb-4">
        Gift {index + 1}
      </h3>

      {/* 💰 MANDATORY BUDGET SELECTOR (Standardized across all gift types) */}
      <div className="mb-4 border-b pb-4 border-rose-200">
        <label className="block text-gray-700 font-medium mb-2">
          Budget <span className="text-red-500">*</span> (Required)
        </label>
        <select
          value={gift.budget || ""}
          onChange={(e) =>
            handleGiftSelection(recipientId, index, "budget", e.target.value)
          }
          className={`w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 ${
            !gift.budget ? "border-red-300 bg-red-50" : "border-rose-300"
          }`}
        >
          <option value="" disabled hidden>Select Budget</option>
          {GLOBAL_BUDGET_OPTIONS.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
            </option>
          ))}
        </select>
        {!gift.budget && (
          <p className="text-red-500 text-xs mt-1">Budget is mandatory</p>
        )}
      </div>

      {/* 🎀 Adult-only packaging style (OPTIONAL) */}
      {ageType === "Adult" && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Packaging Style (Optional)
          </label>
          <p className="text-sm text-gray-500 mb-6">
            (This helps us wrap the gift in a way that matches your recipient's personality and your preferences.)
          </p>
          <div className="flex flex-wrap gap-4">
            {["Handmade & Crafted", "Quirky & Unique", "Funny & Lighthearted"].map((style) => (
              <label key={style} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={gift.preferredStyle?.includes(style) || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    handleGiftSelection(recipientId, index, "preferredStyle", [
                      ...(gift.preferredStyle || []).filter((s) => s !== style),
                      ...(checked ? [style] : []),
                    ]);
                  }}
                />
                <span className="text-gray-700">{style}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 🎁 GIFT TYPE DROPDOWN - KEPT FOR LOGIC BUT HIDDEN FROM UI */}
      {/* Gift type selection is now handled programmatically and not shown to user */}
      <input
        type="hidden"
        value={gift.type || ""}
        onChange={(e) =>
          handleGiftSelection(recipientId, index, "type", e.target.value)
        }
      />

      {/* 🧩 Dynamic Gift Detail Components (unchanged - uses hidden gift type) */}
      {gift.type === "Makeup Products" && gender === "Female" && ageType === "Adult" && (
        <MakeupGiftDetails
          gift={gift}
          recipientId={recipientId}
          index={index}
          handleGiftSelection={handleGiftSelection}
          setGiftValid={setGiftValid}
        />
      )}

      {(gift.type === "Bag/Wallet" || gift.type === "Wallet") && (
        <WalletGiftDetails
          gift={gift}
          recipientId={recipientId}
          index={index}
          handleGiftSelection={handleGiftSelection}
          gender={gender}
          setGiftValid={setGiftValid}
        />
      )}

      {(gift.type === "Jewellery") && ageType !== "Kid" && (
        <JewelleryGiftDetails
          gift={gift}
          recipientId={recipientId}
          index={index}
          handleGiftSelection={handleGiftSelection}
          gender={gender}
          ageType={ageType}
          setGiftValid={setGiftValid}
        />
      )}


      {gift.type === "Edible Stuff" && ageType !== "Kid" && (
        <EdibleGiftDetails
          gift={gift}
          recipientId={recipientId}
          index={index}
          handleGiftSelection={handleGiftSelection}
          setGiftValid={setGiftValid}
        />
      )}

      {gift.type === "Shoes" && (
        <ShoeGiftDetails
          gift={gift}
          recipientId={recipientId}
          index={index}
          handleGiftSelection={handleGiftSelection}
          gender={gender}
          ageType={ageType}
          setGiftValid={setGiftValid}
        />
      )}

      {gift.type === "Clothing" && (
        <ClothingGiftDetails
          gift={gift}
          recipientId={recipientId}
          index={index}
          handleGiftSelection={handleGiftSelection}
          gender={gender}
          ageType={ageType}
          setGiftValid={setGiftValid}
        />
      )}

      {ageType === "Kid" ? (
        <KidGiftDetails
          gift={gift}
          recipientId={recipientId}
          index={index}
          handleGiftSelection={handleGiftSelection}
          setGiftValid={setGiftValid}
        />
      ) : gift.type === "Perfume" ? (
        <PerfumeGiftDetails
          gift={gift}
          recipientId={recipientId}
          index={index}
          handleGiftSelection={handleGiftSelection}
          setGiftValid={setGiftValid}
        />
      ) : null}

    </div>
  );
};

export default GiftItem;