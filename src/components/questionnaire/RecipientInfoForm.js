import React, { useEffect, useCallback } from "react";

const RecipientInfoForm = ({ recipient, setGiftData, setIsStepValid }) => {
  const handleChange = useCallback((field, value) => {
    setGiftData((prev) =>
      prev.map((r) => {
        if (r.id !== recipient.id) return r;

        const updatedRecipient = { ...r, [field]: value };

        // Auto-set ageType if the relationship requires it
        if (
          field === "relationship" &&
          ["Colleague/Professional", "Spouse"].includes(value)
        ) {
          updatedRecipient.ageType = "Adult";
        }

        return updatedRecipient;
      })
    );
  }, [recipient.id, setGiftData]);




  const handleOccasionChange = (occ, checked) => {
    setGiftData((prev) =>
      prev.map((r) =>
        r.id === recipient.id
          ? {
            ...r,
            occasion: checked
              ? [...(r.occasion || []), occ]
              : (r.occasion || []).filter((o) => o !== occ),
          }
          : r
      )
    );
  };




  const ageOptions =
    recipient.ageType === "Kid"
      ? ["Less than a year", "1–3", "3–6", "6–9", "9–12", "12–15"]
      : ["16–20", "20–25", "25–35", "More than 35 years"];

  const isAutoAdult =
    recipient.relationship &&
    ["Colleague/Professional", "Spouse"].includes(recipient.relationship);

  const toyOptions = [
    "Building Toys (e.g. LEGO)",
    "Dolls",
    "Arts & Crafts",
    "Outdoor/ Sports",
    "Tech/ Games",
    "Other",
  ];

  const dislikeOptions = [
    "Noisy Toys",
    "Messy Crafts",
    "Animated Cartoons",
    "Labubu Dolls",
    "Electronic Gadgets",
    "Stuffed Animals",
    "Other",
  ];

  useEffect(() => {
    let valid =
      recipient.occasion?.length > 0 &&
      !!recipient.relationship &&
      !!recipient.gender &&
      (!!recipient.ageType) &&
      !!recipient.ageGroup;

    if (recipient.ageType === "Kid") {
      valid =
        valid &&
        recipient.kidDislikes?.length > 0 &&
        recipient.kidToyTypes?.length > 0;
    }

    if (recipient.ageType === "Adult") {
      valid = valid && !!recipient.knownDuration;
    }

    setIsStepValid(valid);
  }, [recipient, isAutoAdult, setIsStepValid]);

  const isAdultOnlyRelationship =
    ["Colleague/Professional", "Spouse"].includes(recipient.relationship);

  const isAdultOnlyOccasion = recipient.occasion?.some((occ) =>
    ["Wedding/Engagement gift", "Anniversary"].includes(occ)
  );

  const forceAdult = isAdultOnlyRelationship || isAdultOnlyOccasion;


useEffect(() => {
  if (forceAdult && recipient.ageType !== "Adult") {
    handleChange("ageType", "Adult");
  }
}, [forceAdult, recipient.ageType, handleChange]);


  return (
    <div className="mb-6 space-y-4">
      {/* Occasion */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Occasion
        </label>
        <div className="flex flex-wrap gap-3">
          {["Birthday", "Anniversary", "Holiday", "Graduation", "Wedding/Engagement gift", "Thank you gift", "Get well soon", "Other"].map(
            (occ) => (
              <label key={occ} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={recipient.occasion?.includes(occ) || false}
                  onChange={(e) =>
                    handleOccasionChange(occ, e.target.checked)
                  }
                />
                <span className="text-gray-700">{occ}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Relationship */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Relationship
        </label>
        <div className="flex flex-wrap gap-4">
          {["Close Family(Parent, Sibling, Child)", "Extended Family (Aunt, Uncle, Cousin)", "Friend", "Colleague/Professional", "Spouse", "Other"].map((rel) => (
            <label key={rel} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`relationship-${recipient.id}`}
                checked={recipient.relationship === rel}
                onChange={() => handleChange("relationship", rel)}
              />
              <span className="text-gray-700">{rel}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Gender */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Gender</label>
        <div className="flex gap-6">
          {["Female", "Male"].map((gender) => (
            <label key={gender} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`gender-${recipient.id}`}
                checked={recipient.gender === gender}
                onChange={() => handleChange("gender", gender)}
              />
              <span className="text-gray-700">{gender}</span>
            </label>
          ))}
        </div>
      </div>



      {!forceAdult && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Is the recipient a kid or an adult?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`ageType-${recipient.id}`}
                value="Kid"
                checked={recipient.ageType === "Kid"}
                onChange={(e) => handleChange("ageType", e.target.value)}
              />
              <span className="text-gray-700">Kid</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`ageType-${recipient.id}`}
                value="Adult"
                checked={recipient.ageType === "Adult"}
                onChange={(e) => handleChange("ageType", e.target.value)}
              />
              <span className="text-gray-700">Adult</span>
            </label>
          </div>

        </div>
      )}



      {/* Age Group */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Age Group
        </label>
        <select
          value={recipient.ageGroup || ""}
          onChange={(e) => handleChange("ageGroup", e.target.value)}
          disabled={!recipient.ageType}
          className="w-full border border-rose-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          <option value="" disabled selected hidden>
            Select age group
          </option>
          {ageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* 👶 Kid-specific Questions */}
      {recipient.ageType === "Kid" && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Does the child have any strong dislikes?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dislikeOptions.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={recipient.kidDislikes?.includes(option) || false}
                    onChange={() =>
                      setGiftData((prev) =>
                        prev.map((r) =>
                          r.id === recipient.id
                            ? {
                              ...r,
                              kidDislikes: r.kidDislikes?.includes(option)
                                ? r.kidDislikes.filter((d) => d !== option)
                                : [...(r.kidDislikes || []), option],
                            }
                            : r
                        )
                      )
                    }
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Does the child have a favorite type of toy or activity?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {toyOptions.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={recipient.kidToyTypes?.includes(option) || false}
                    onChange={() =>
                      setGiftData((prev) =>
                        prev.map((r) =>
                          r.id === recipient.id
                            ? {
                              ...r,
                              kidToyTypes: r.kidToyTypes?.includes(option)
                                ? r.kidToyTypes.filter((t) => t !== option)
                                : [...(r.kidToyTypes || []), option],
                            }
                            : r
                        )
                      )
                    }
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {recipient.ageType === "Adult" && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            How long have you known the recipient?
          </label>


          <div className="flex flex-col space-y-2">
            {["Less than a year", "1–3 year", "3–5 year", "5+ year"].map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`knownDuration-${recipient.id}`} // important!
                  value={option}
                  checked={recipient.knownDuration === option}
                  onChange={(e) => {
                    handleChange("knownDuration", e.target.value);
                  }}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};


export default RecipientInfoForm;
