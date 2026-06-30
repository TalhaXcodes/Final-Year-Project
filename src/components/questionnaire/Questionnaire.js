import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import GiftList from "./GiftList";
import GiftPackaging from "./GiftPackaging";
import PersonalityAnalysisForm from "./PersonalityAnalysisForm";
import RecipientInfoForm from "./RecipientInfoForm";

// 💰 GLOBAL BUDGET SYSTEM (Standardized across all gift types)
export const GLOBAL_BUDGET_OPTIONS = [
  "1000–3000 PKR",
  "3000–5000 PKR",
  "5000–8000 PKR",
  "8000–10,000 PKR",
  "10,000–15,000 PKR",
  "15,000+ PKR"
];

const Questionnaire = () => {
  // 🎯 PRODUCTION-READY CONFIGURATION
  const maxTotalItems = 1; // Global system limit: max 1 gift total
  const recipients = 1; // Single recipient flow (no dynamic count)

  // Phase flow: recipients → personality → packaging → feedback
  const [phase, setPhase] = useState("recipients");
  const [giftData, setGiftData] = useState([
    { id: 1, gifts: [{}], knownDuration: "", ageType: "", gender: "" }
  ]);
  const [recipientStepIndex] = useState(0);
  const [recipientSubStep, setRecipientSubStep] = useState(1);
  const [personalityData, setPersonalityData] = useState({});
  const [packagingChoice, setPackagingChoice] = useState("");
  const [isStepValid, setIsStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Prevent users from selecting more than the allowed number of gifts
  const handleGiftCountChange = (recipientId, count) => {
    const newGiftCount = parseInt(count);
    if (newGiftCount <= maxTotalItems) {
      setGiftData((prev) =>
        prev.map((recipient) =>
          recipient.id === recipientId
            ? { ...recipient, gifts: Array(newGiftCount).fill({}) }
            : recipient
        )
      );
    } else {
      alert(`Total gifts cannot exceed ${maxTotalItems}.`);
    }
  };

  // ✅ Handle gift field updates (budget, type, details, etc.)
  const handleGiftSelection = (recipientId, giftIndex, field, value) => {
    setGiftData((prev) =>
      prev.map((recipient) =>
        recipient.id === recipientId
          ? {
            ...recipient,
            gifts: recipient.gifts.map((gift, idx) =>
              idx === giftIndex ? { ...gift, [field]: value } : gift
            ),
          }
          : recipient
      )
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {

      // 1. Save response to Firestore
      await addDoc(collection(db, "questionnaireResponses"), {
        timestamp: serverTimestamp(),
        recipientsCount: recipients,
        responses: giftData,
        personality: personalityData,
        packaging: packagingChoice
      });

      const sanitizedGiftData = giftData.map((recipient) => ({
        ...recipient,
        gifts: recipient.gifts.map((gift) => ({
          ...gift,
          price: gift.price || gift.budget || "Not specified",
          budget: gift.budget || "Not specified",
        })),
      }));

      // 2. Send data to Flask recommendation API
      const response = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responses: sanitizedGiftData,
          personality: personalityData,
        }),
      });

      // 3. Get recommendations
      const data = await response.json();


      // 4. Navigate with recommendations
      navigate("/thank-you", {
        state: {
          recommendations: data.recommendations,
          traitScores: data.traitScores,
          packagingChoice,
          userPreferences: {
            giftData,
            personalityData,
            packagingChoice,
          }
        },
      });

    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-rose-700 mb-6 sm:mb-8">
        Gift Basket Questionnaire
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* ===== PHASE: RECIPIENT INFO ===== */}
        {phase === "recipients" && recipientSubStep === 1 && (
          <>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-rose-300 mb-6">
              <h2 className="text-2xl font-semibold text-rose-600 mb-4 text-center">
                Recipient Information
              </h2>

              <RecipientInfoForm
                recipient={giftData[recipientStepIndex]}
                setGiftData={setGiftData}
                setIsStepValid={setIsStepValid}
              />

              <div className="flex flex-col items-end mt-6">
                <p
                  className={`text-red-500 text-sm mb-1 transition-opacity duration-300 ${isStepValid ? "opacity-0" : "opacity-100"
                    }`}
                >
                  Please fill all required fields before proceeding
                </p>

                <div className="flex justify-between items-center w-full">
                  <div />
                  <button
                    onClick={() => setRecipientSubStep(3)}
                    disabled={!isStepValid}
                    className={`py-2.5 px-4 sm:px-6 text-sm sm:text-base rounded-md transition
                      ${isStepValid
                        ? "bg-rose-600 text-white hover:bg-rose-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        

        {/* ===== PHASE: GIFT DETAILS ===== */}
        {phase === "recipients" && recipientSubStep === 3 && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-rose-300 mb-6">
            <h2 className="text-2xl font-semibold text-rose-600 mb-4 text-center">
              Gift Details
            </h2>

            <GiftList
              recipient={giftData[recipientStepIndex]}
              recipients={recipients}
              giftOptions={
                giftData[recipientStepIndex]?.gender === "Female"
                  ? [
                    "Clothing",
                    "Shoes",
                    "Bag/Wallet",
                    "Jewellery",
                    "Perfume",
                    "Edible Stuff",
                    "Makeup Products",
                  ]
                  : [
                    "Clothing",
                    "Shoes",
                    "Jewellery",
                    "Perfume",
                    "Edible Stuff",
                    "Wallet",
                  ]
              }
              handleGiftCountChange={handleGiftCountChange}
              handleGiftSelection={handleGiftSelection}
              maxTotalItems={maxTotalItems}
              giftData={giftData}
              setIsStepValid={setIsStepValid}
              GLOBAL_BUDGET_OPTIONS={GLOBAL_BUDGET_OPTIONS}
            />

            <div className="mt-6 flex flex-col items-end">
              {!isStepValid && (
                <p className="text-red-500 text-sm mb-1 transition-opacity duration-300 opacity-100">
                  Please fill all required fields before proceeding
                </p>
              )}

              <div className="flex justify-between w-full">
                <button
                  type="button"
                  onClick={() => setRecipientSubStep(1)}
                  className="bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 transition"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isStepValid) return;
                    setPhase("personality");
                  }}
                  disabled={!isStepValid}
                  className={`py-2 px-4 rounded-md transition
            ${isStepValid
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== PHASE: PERSONALITY ===== */}
        {phase === "personality" && (
          <div className="space-y-6">
            <PersonalityAnalysisForm
              personalityData={personalityData}
              setPersonalityData={setPersonalityData}
            />

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setPhase("recipients")}
                className="bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 transition"
              >
                Back
              </button>

              <button
                onClick={() => setPhase("packaging")}
                className="bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ===== PHASE: PACKAGING ===== */}
        {phase === "packaging" && (
          <div className="space-y-6">
            <GiftPackaging
              packagingChoice={packagingChoice}
              setPackagingChoice={setPackagingChoice}
              setIsStepValid={setIsStepValid}
            />

            <div className="flex flex-col items-end mt-6">
              {!packagingChoice && (
                <p className="text-red-500 text-sm mb-2">
                  Please select a packaging option before proceeding
                </p>
              )}

              <div className="flex justify-between w-full">
                <button
                  onClick={() => setPhase("personality")}
                  className="bg-rose-600 text-white py-2.5 px-4 sm:px-6 text-sm sm:text-base rounded-md hover:bg-rose-700 transition"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!packagingChoice) return;
                    handleSubmit(new Event("submit"));
                  }}
                  disabled={!packagingChoice}
                  className={`py-2.5 px-4 sm:px-6 text-sm sm:text-base rounded-md transition
    ${packagingChoice
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Questionnaire;