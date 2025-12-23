import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import FeedbackSection from "./FeedbackSection";
import GiftList from "./GiftList";
import GiftPackaging from "./GiftPackaging";
import PersonalityAnalysisForm from "./PersonalityAnalysisForm";
import RecipientInfoForm from "./RecipientInfoForm";


const Questionnaire = () => {
  const maxTotalItems = 10;
  const [phase, setPhase] = useState("recipients-count");
  const [recipients, setRecipients] = useState(1);
  const [giftData, setGiftData] = useState([{ id: 1, gifts: [{}], knownDuration: "", ageType: "", gender: "" }]);
  const [recipientStepIndex, setRecipientStepIndex] = useState(0);
  const [recipientSubStep, setRecipientSubStep] = useState(1);
  const [personalityData, setPersonalityData] = useState({});
  const [packagingChoice, setPackagingChoice] = useState("");
  const [feedbackData, setFeedbackData] = useState({
    helpful: "",
    suggestion: "",
  });
  const [isStepValid, setIsStepValid] = useState(false);




  const maxRecipients = 10;

  const handleRecipientChange = (e) => {
    const newCount = parseInt(e.target.value);

    // Count how many gifts are already allocated
    const allocatedGifts = giftData.reduce((sum, r) => sum + (r.gifts?.length || 0), 0);

    // Check if there's enough room for new recipients
    const maxRecipientsAllowed = maxTotalItems - allocatedGifts + giftData.length;

    if (newCount > maxRecipientsAllowed) {
      alert(
        `You have already allocated ${allocatedGifts} gifts. You can select up to ${maxRecipientsAllowed} recipients based on remaining gift capacity.`
      );
      return; // Don't update recipient count
    }

    setRecipients(newCount);

    const newGiftData = Array.from({ length: newCount }, (_, i) => {
      const existing = giftData[i] || {};
      return {
        ...existing,
        id: i + 1,
        gifts: existing.gifts?.length > 0 ? existing.gifts : [{}],
        knownDuration: existing.knownDuration || "",
        ageType: existing.ageType || "",
        gender: existing.gender || "",
      };
    });

    setGiftData(newGiftData);
  };


  const handleGiftCountChange = (recipientId, count) => {
    const totalGifts = giftData.reduce((sum, r) => sum + (r.gifts.length || 0), 0);
    const newGiftCount = parseInt(count);
    if (totalGifts + newGiftCount - (giftData[recipientId - 1]?.gifts.length || 0) <= maxTotalItems) {
      setGiftData((prev) =>
        prev.map((recipient) =>
          recipient.id === recipientId
            ? { ...recipient, gifts: Array(newGiftCount).fill({}) }
            : recipient
        )
      );
    } else {
      alert(`Total gifts across all recipients cannot exceed ${maxTotalItems}.`);
    }
  };

  const handleGiftSelection = (recipientId, giftIndex, field, value) => {
    console.log("Updating:", field, "=", value);
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

  const navigate = useNavigate();



  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // 🚫 block duplicates
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "questionnaireResponses"), {
        timestamp: serverTimestamp(), // records submission time
        recipientsCount: recipients,  // example state variable
        responses: giftData,           // your existing responses array/object
        personality: personalityData,
        packaging: packagingChoice,
        feedback: feedbackData
      });
      navigate("/thank-you");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Something went wrong while submitting.");
      setIsSubmitting(false); // allow retry only if failed
    }
  };


  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-rose-700 mb-6 sm:mb-8">
        Gift Basket Questionnaire
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {phase === "recipients-count" && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-rose-300">
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
              How many recipients for the gift baskets? (Max: {maxRecipients})
            </label>
            <select
              value={recipients}
              onChange={handleRecipientChange}
              className="w-full border border-rose-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              {[...Array(maxTotalItems).keys()].map(i => i + 1).filter(i => {
                const allocatedGifts = giftData.reduce((sum, r) => sum + (r.gifts?.length || 0), 0);
                const maxRecipientsAllowed = maxTotalItems - allocatedGifts + giftData.length;
                return i <= maxRecipientsAllowed;
              })
                .map(i => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
            </select>
            <div className="flex gap-3 mt-6 justify-end">
              <button className="bg-rose-600 text-white py-3 px-4 text-sm sm:text-base rounded-md hover:bg-rose-700 transition" onClick={() => setPhase("recipients")}>Next</button>
            </div>
          </div>
        )}

        {phase === "recipients" && recipientSubStep === 1 && (
          <>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-rose-300 mb-6">
              <h2 className="text-2xl font-semibold text-rose-600 mb-4 text-center">
                Recipient {recipientStepIndex + 1} of {recipients}
              </h2>

              <RecipientInfoForm
                recipient={giftData[recipientStepIndex]}
                setGiftData={setGiftData}
                setIsStepValid={setIsStepValid}
              />

              <div className="flex flex-col items-end mt-6">
                {/* Message displayed above Next button with fade effect */}
                <p
                  className={`text-red-500 text-sm mb-1 transition-opacity duration-300 ${isStepValid ? "opacity-0" : "opacity-100"
                    }`}
                >
                  Please fill all required fields before proceeding
                </p>

                <div className="flex justify-between items-center w-full">
                  <button
                    onClick={() => {
                      if (recipientStepIndex === 0) {
                        setPhase("recipients-count");
                      } else {
                        setRecipientStepIndex((i) => i - 1);
                        setRecipientSubStep(3);
                      }
                    }}
                    className="bg-rose-600 text-white py-2.5 px-4 sm:px-6 text-sm sm:text-base rounded-md hover:bg-rose-700 transition"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setRecipientSubStep(2)}
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

        {phase === "recipients" && recipientSubStep === 2 && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-rose-300 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Number of gifts for recipient {recipientStepIndex + 1}
            </h2>

            {(() => {
              const currentRecipient = giftData[recipientStepIndex];
              const giftsAssignedToOthers = giftData.reduce(
                (sum, r) =>
                  r.id !== currentRecipient.id ? sum + (r.gifts.length || 0) : sum,
                0
              );
              const remainingForThisRecipient = maxTotalItems - giftsAssignedToOthers;
              const minSelectable = 1;
              const maxSelectable = Math.min(
                remainingForThisRecipient,
                maxTotalItems - (recipients - 1)
              );

              return (
                <select
                  value={currentRecipient.gifts.length}
                  onChange={(e) =>
                    handleGiftCountChange(currentRecipient.id, e.target.value)
                  }
                  className="w-full border border-rose-300 p-3 rounded-md"
                >
                  {[...Array(maxSelectable).keys()]
                    .map((i) => i + minSelectable)
                    .map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                </select>
              );
            })()}

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setRecipientSubStep(1)}
                className="bg-rose-600 text-white py-2.5 px-4 sm:px-6 text-sm sm:text-base rounded-md hover:bg-rose-700 transition"
              >
                Back
              </button>
              <button
                onClick={() => setRecipientSubStep(3)}
                className="bg-rose-600 text-white py-2.5 px-4 sm:px-6 text-sm sm:text-base rounded-md hover:bg-rose-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}


        {phase === "recipients" && recipientSubStep === 3 && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-rose-300 mb-6">
            <h2 className="text-2xl font-semibold text-rose-600 mb-4 text-center">
              Gift Details - Recipient {recipientStepIndex + 1}
            </h2>
            <GiftList
              recipient={giftData[recipientStepIndex]}
              recipients={recipients}
              giftOptions={
                giftData[recipientStepIndex]?.gender === "Female"
                  ? ["Clothing", "Shoes", "Bag/Wallet", "Jewellery", "Perfume", "Edible Stuff", "Makeup Products"]
                  : ["Clothing", "Shoes", "Jewellery", "Perfume", "Edible Stuff", "Wallet"]
              }
              handleGiftCountChange={handleGiftCountChange}
              handleGiftSelection={handleGiftSelection}
              maxTotalItems={maxTotalItems}
              giftData={giftData}
              setIsStepValid={setIsStepValid}
            />

            <div className="mt-6 flex flex-col items-end">
              {/* Warning message above Next button */}
              {!isStepValid && (
                <p className="text-red-500 text-sm mb-1 transition-opacity duration-300 opacity-100">
                  Please fill all required fields before proceeding
                </p>
              )}

              <div className="flex justify-between w-full">
                <button
                  onClick={() => setRecipientSubStep(2)}
                  className="bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 transition"
                >
                  Back
                </button>

                <button
                  onClick={() => {
                    if (!isStepValid) return; // safety guard, shouldn’t trigger if disabled
                    if (recipientStepIndex < recipients - 1) {
                      setRecipientStepIndex((prev) => prev + 1);
                      setRecipientSubStep(1);
                    } else {
                      setPhase("personality");
                    }
                  }}
                  disabled={!isStepValid}  // 👈 disable if invalid
                  className={`py-2 px-4 rounded-md transition 
        ${isStepValid
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {recipientStepIndex === recipients - 1
                    ? "Next"
                    : "Continue to Next Recipient"}
                </button>
              </div>
            </div>

          </div>
        )}





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
        )
        }


        {
          phase === "packaging" && (
            <div className="space-y-6">
              <GiftPackaging
                packagingChoice={packagingChoice}
                setPackagingChoice={setPackagingChoice}
                setIsStepValid={setIsStepValid}
              />

              <div className="flex flex-col items-end mt-6">
                {/* Warning message above Next button */}
                {!packagingChoice && (
                  <p className="text-red-500 text-sm mb-1 transition-opacity duration-300 opacity-100">
                    Please select a packaging option before proceeding
                  </p>
                )}

                <div className="flex justify-between w-full">
                  <button
                    onClick={() => setPhase("personality")}
                    disabled={!isStepValid}
                    className={`px-4 py-2 rounded ${isStepValid ? "bg-rose-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                  >
                    Back
                  </button>

                  <button
                    onClick={() => {
                      if (packagingChoice) {
                        setPhase("feedback");
                      }
                    }}
                    disabled={!packagingChoice} // ✅ disable until user selects a packaging
                    className={`py-2 px-4 rounded-md transition ${packagingChoice
                      ? "bg-rose-600 text-white hover:bg-rose-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>
          )
        }


        {
          phase === "feedback" && (
            <div className="space-y-6">
              <FeedbackSection
                feedbackData={feedbackData}
                setFeedbackData={setFeedbackData}
              />

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setPhase("packaging")}
                  className="bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 transition"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 transition"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )
        }


      </form >
    </div >
  );
};

export default Questionnaire;
