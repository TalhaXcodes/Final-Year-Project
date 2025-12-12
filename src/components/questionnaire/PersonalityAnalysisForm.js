import React from "react";

const emojiScale = ["😐", "🙂", "😊", "😄", "😍"];

const PersonalityAnalysisForm = ({ personalityData, setPersonalityData }) => {
  const handleChange = (field, value) => {
    setPersonalityData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const questionLabels = {
    personality: "How would you describe the recipient's personality?",
    connectionImportance:
      "How important is it for you to make the gift recipient feel special or emotionally connected through your gift?",
    handmadePreference: "Do you enjoy incorporating handmade elements into gifts?",
    stylePreference: "What colors or textures do you find most appealing for gift baskets?",
    surpriseReaction: "How does the recipient react to surprises?",
    relationshipCloseness: "How close are you to the recipient?",
    practicalOverSentimental:
      "How likely is the recipient to appreciate practical gifts (e.g., Hair-dryer, Hairstraightener) over sentimental ones?",
    uniqueGiftValue: "How much does the recipient value gifts that are unique or one-of-a-kind?",
    experiencePreference:
      "How likely is the recipient to enjoy experience-based gifts (e.g., concert tickets, cooking classes) over physical items?",
    budgetFlexibility:
      "How comfortable are you with spending above your budget for a high-quality or meaningful gift?",
    sharedMemoriesAppreciation:
      "How much does the recipient appreciate gifts that reflect shared memories or inside jokes?",
    noteImportance: "How much do you agree that a handwritten note adds significant value to the gift?",
    handmadeOverStore:
      "How likely are you to prioritize a handmade or DIY gift over a store-bought one to stay within budget?",
  };


  const renderSlider = (fieldName, labelLeft, labelRight) => {
    const value = personalityData[fieldName] || "3"; // default to 3 (middle)

    return (
      <div className="mb-8">
        <label className="block text-gray-700 font-semibold mb-3">
          {questionLabels[fieldName] || fieldName}
        </label>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-1 px-1">
          <span>{labelLeft}</span>
          <span>{labelRight}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-3xl w-10">{emojiScale[parseInt(value) - 1]}</span>

          <input
            type="range"
            min="1"
            max="5"
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className="w-full accent-rose-500"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-rose-300 mt-8">
      <h2 className="text-2xl font-semibold text-rose-600 mb-6 text-center">
        🎭 Recipient Personality Analysis
      </h2>

      {renderSlider("personality", "Introvert", "Extrovert")}
      {renderSlider("connectionImportance", "Less important", "Highly important")}
      {renderSlider("handmadePreference", "Not at all", "Absolutely")}
      {renderSlider("stylePreference", "Neutral", "Vibrant")}
      {renderSlider("surpriseReaction", "Not sure", "Loves them")}
      {renderSlider("relationshipCloseness", "Not close", "Very close")}
      {renderSlider("practicalOverSentimental", "Sentimental", "Practical")}
      {renderSlider("uniqueGiftValue", "Common gifts", "Unique gifts")}
      {renderSlider("experiencePreference", "Physical items", "Experiences")}
      {renderSlider("budgetFlexibility", "Not comfortable", "Very comfortable")}
      {renderSlider("sharedMemoriesAppreciation", "Not at all", "Greatly appreciates")}
      {renderSlider("noteImportance", "Disagree", "Strongly agree")}
      {renderSlider("handmadeOverStore", "Unlikely", "Very likely")}
    </div>
  );
};

export default PersonalityAnalysisForm;
