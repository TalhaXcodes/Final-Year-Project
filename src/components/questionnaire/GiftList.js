import React, { useEffect, useCallback, useState } from "react";
import GiftItem from "./GiftItem";

const GiftList = ({
  recipient,
  recipients,
  giftOptions,
  handleGiftCountChange,
  handleGiftSelection,
  maxTotalItems,
  giftData,
  setIsStepValid
}) => {

  const [giftValidities, setGiftValidities] = useState(
    recipient.gifts.map(() => false) // default all invalid
  );

  useEffect(() => {
  const allValid = giftValidities.every(Boolean);
  setIsStepValid(allValid);   // 👈 comes as a prop from Questionnaire
}, [giftValidities, setIsStepValid]);



  const setGiftValid = useCallback((giftIndex, isValid) => {
  setGiftValidities((prev) => {
    const updated = [...prev];
    updated[giftIndex] = isValid;
    return updated;
  });
}, []);




  return (
    <div className="space-y-6">

      {/* 🎁 Gift inputs */}
      {recipient.gifts.map((gift, index) => (
        <GiftItem
          key={index}
          gift={gift}
          recipientId={recipient.id}
          index={index}
          handleGiftSelection={handleGiftSelection}
          giftOptions={giftOptions}
          ageType={recipient.ageType}
          gender={recipient.gender}
          setGiftValid={setGiftValid}
        />
      ))}
    </div>
  );
};

export default GiftList;
