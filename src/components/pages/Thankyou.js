import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "giftPilotResults";

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [templateMessage, setTemplateMessage] = useState("");

  const [pageData, setPageData] = useState(() => {
    if (location.state) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location.state));
      return location.state;
    }

    const savedData = sessionStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    if (location.state) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location.state));
      setPageData(location.state);
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const traitScores = pageData?.traitScores || {};
  const rawRecommendations = pageData?.recommendations || [];
  const userPreferences = pageData?.userPreferences || {};
  const packagingChoice = pageData?.packagingChoice || "";

  const recommendations = useMemo(() => {
    return (
      rawRecommendations?.[0]?.recommendations?.[0]?.recommendations ||
      rawRecommendations?.[0]?.recommendations ||
      rawRecommendations ||
      []
    );
  }, [rawRecommendations]);
  console.log(
    JSON.parse(JSON.stringify(recommendations))
  );

  const getGiftType = (item) => {
    if (typeof item === "string") return item;

    return (
      item?.gift_type ||
      item?.giftType ||
      item?.category ||
      item?.name ||
      "Gift"
    );
  };

  const getConfidence = (item) => {
    if (typeof item === "string") return 1;
    return item?.confidence || 1;
  };

  const getGiftEmoji = (giftType) => {
    switch (giftType) {
      case "Accessories":
        return "💍";
      case "Bag / Wallet":
      case "Bag/Wallet":
      case "Wallet":
        return "👜";
      case "Clothing":
        return "👗";
      case "Edible Stuff":
        return "🍫";
      case "Makeup Products":
        return "💄";
      case "Perfume":
        return "🌸";
      case "Shoes":
        return "👟";
      case "Toys":
        return "🧸";
      case "Jewellery":
        return "💎";
      default:
        return "🎁";
    }
  };

  const formatTraitName = (trait) => {
    return trait
      .replace(/([A-Z])/g, " $1")
      .replace("Score", "")
      .trim();
  };

  const normalizeText = (text) => String(text || "").trim().toLowerCase();

  const getBudgetRange = (budget) => {
    const text = String(budget || "");

    if (text.includes("1000") && text.includes("3000"))
      return [1000, 3000];

    if (text.includes("3000") && text.includes("5000"))
      return [3000, 5000];

    if (text.includes("5000") && text.includes("8000"))
      return [5000, 8000];

    if (text.includes("8000"))
      return [8000, 10000];

    if (text.includes("10000") && text.includes("15000"))
      return [10000, 15000];

    if (text.includes("15000"))
      return [15000, Number.MAX_SAFE_INTEGER];

    return [0, Number.MAX_SAFE_INTEGER];
  };

  const isWithinBudget = (price, budget) => {

    const [min, max] = getBudgetRange(budget);

    return price >= min && price <= max;

  };

  const getBudgetScore = (price, budget) => {

    const [min, max] = getBudgetRange(budget);

    if (price >= min && price <= max)
      return 15;

    const distance = Math.min(
      Math.abs(price - min),
      Math.abs(price - max)
    );

    if (distance <= 1000)
      return 10;

    if (distance <= 3000)
      return 5;

    return 0;
  };

  const arrayIncludesValue = (array, value) => {
    if (!Array.isArray(array)) return false;

    return array.some((item) => normalizeText(item) === normalizeText(value));
  };

  const scoreTemplate = (template, category) => {
    const recipient = userPreferences?.giftData?.[0] || {};

    const userGender = recipient.gender || "";
    const userAgeGroup = recipient.ageGroup || "";
    const userOccasion = recipient.occasion || [];
    const userBudget = recipient.gifts?.[0]?.budget || "";

    console.log({
      gender: userGender,
      age: userAgeGroup,
      occasion: userOccasion,
      budget: userBudget
    });

    let score = 0;

    // ===========================
    // CATEGORY MATCH (35)
    // ===========================

    if (normalizeText(template.category) === normalizeText(category)) {
      score += 35;
    }

    // ===========================
    // GENDER MATCH (20)
    // ===========================

    if (
      normalizeText(template.gender) === normalizeText(userGender) ||
      normalizeText(template.gender) === "unisex"
    ) {
      score += 20;
    }

    // ===========================
    // AGE GROUP MATCH (15)
    // ===========================

    if (
      arrayIncludesValue(template.ageGroups, userAgeGroup) ||
      arrayIncludesValue(template.ageGroup, userAgeGroup)
    ) {
      score += 15;
    }

    // ===========================
    // OCCASION MATCH (15)
    // ===========================

    if (
      arrayIncludesValue(template.occasionTags, userOccasion) ||
      arrayIncludesValue(template.occasion, userOccasion)
    ) {
      score += 15;
    }

    // ===========================
    // BUDGET MATCH (15)
    // ===========================

    score += getBudgetScore(
      Number(template.price || 0),
      userBudget
    );



    // ===========================
    // STOCK BONUS (2)
    // ===========================

    if (
      template.isAvailable &&
      Number(template.stock || 0) > 0
    ) {
      score += 2;
    }

    return score;
  };

  const handleCategorySelect = async (category) => {
    const cleanedCategory = String(category || "").trim();

    if (!cleanedCategory) return;

    setSelectedCategory(cleanedCategory);
    setLoadingTemplate(true);
    setTemplateMessage("");

    try {

      const recommendation = recommendations.find(
        (item) => item.gift_type === cleanedCategory
      );

      if (!recommendation) {
        setTemplateMessage(
          `No recommendation found for ${cleanedCategory}.`
        );
        return;
      }

      const templates = recommendation.templates || [];

      if (templates.length === 0) {
        setTemplateMessage(
          `No matching basket found for ${cleanedCategory}.`
        );
        return;
      }

      const rankedTemplates = templates
        .map((template) => ({
          ...template,
          matchScore: scoreTemplate(template, cleanedCategory),
        }))
        .sort((a, b) => b.matchScore - a.matchScore);

      const bestTemplate = rankedTemplates[0];

      console.log("Selected Category:", cleanedCategory);
      console.log("Recommendation:", recommendation);
      console.log("Templates:", templates);
      console.log("Best Template:", bestTemplate);

      navigate("/recommend-basket", {
        state: {
          selectedCategory: cleanedCategory,
          selectedTemplate: bestTemplate,
          packagingChoice,
          recommendations,
          traitScores,
          userPreferences,
        },
      });

    } catch (error) {
      console.error("HANDLE CATEGORY ERROR:", error);
      console.error(error.stack);

      setTemplateMessage("Something went wrong.");
    } finally {
      setLoadingTemplate(false);
    }
  };

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
        <div className="bg-white border border-rose-300 rounded-3xl shadow-lg max-w-xl w-full p-8 text-center">
          <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-4xl">
            🎁
          </div>

          <h1 className="text-2xl font-bold text-rose-700 mb-3">
            No recommendations found
          </h1>

          <p className="text-gray-600 mb-6">
            Please submit the questionnaire again to generate GiftPilot
            recommendations.
          </p>

          <Link
            to="/questionnaire"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-7 py-3 rounded-xl font-semibold transition"
          >
            Start Questionnaire
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4 py-10">
      <div
        className={`bg-white border border-rose-300 rounded-3xl shadow-2xl max-w-3xl w-full p-8 sm:p-10 transform transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <div className="text-center">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center shadow-inner">
            <span className="text-5xl">🎁</span>
          </div>

          <h1 className="text-4xl font-bold text-rose-700 mb-4">
            Your GiftPilot Recommendations
          </h1>

          <p className="text-gray-600 leading-relaxed mb-10">
            Based on your selected preferences and recipient details, GiftPilot
            selected these gift categories specially for you.
          </p>
        </div>

        {Object.keys(traitScores).length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-rose-700 mb-5 text-center">
              Personality Trait Scores
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(traitScores).map(([trait, score]) => (
                <div
                  key={trait}
                  className="bg-rose-50 border border-rose-200 rounded-2xl p-4"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700 capitalize">
                      {formatTraitName(trait)}
                    </span>

                    <span className="font-bold text-rose-600">{score}%</span>
                  </div>

                  <div className="w-full bg-rose-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-rose-500 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-rose-700 text-center">
            Recommended Gift Categories
          </h2>

          {recommendations.length > 0 ? (
            recommendations.map((item, index) => {
              const giftType = getGiftType(item);
              const confidence = getConfidence(item);
              const getRecommendationLabel = (confidence) => {
                const percentage = confidence * 100;

                if (percentage >= 45)
                  return "Highly Recommended";

                if (percentage >= 10)
                  return "Recommended";

                return "Worth Considering";
              };
              const isSelected = selectedCategory === giftType;

              return (
                <button
                  type="button"
                  key={`${giftType}-${index}`}
                  onClick={() => handleCategorySelect(giftType)}
                  disabled={loadingTemplate}
                  className={`w-full text-left bg-gradient-to-r from-rose-50 to-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${isSelected
                    ? "border-rose-500 ring-2 ring-rose-200"
                    : "border-rose-200"
                    }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-2xl">
                        {getGiftEmoji(giftType)}
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-rose-700">
                          {giftType}
                        </h3>

                        <p className="text-sm text-gray-500">
                          GiftPilot Recommendation #{index + 1}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Click to view matching basket
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {getRecommendationLabel(confidence)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-rose-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-rose-500 h-3 rounded-full transition-all duration-700"
                        style={{
                          width: `${(confidence * 100).toFixed(0)}%`,
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center text-gray-600">
              No recommendations found. Please try submitting the questionnaire
              again.
            </div>
          )}
        </div>

        {loadingTemplate && (
          <div className="mt-8 bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center text-gray-600">
            Loading best matching basket...
          </div>
        )}

        {!loadingTemplate && templateMessage && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center text-gray-700">
            {templateMessage}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105"
          >
            Back to Home
          </Link>

          <p className="text-sm text-gray-400 mt-6">
            © BASKETRIES — GiftPilot Personalized Gifting Experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;