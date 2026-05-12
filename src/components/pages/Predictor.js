import { useMemo, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

const initialForm = {
  gender: "female",
  age_group: "20-25",
  age_type: "adult",
  relationship: "friend",
  occasion: "birthday",
  gift_item_style: "handmade & crafted",
  container_type: "basket with ribbon",
  price_mid: 5000,
  personality_score: 3,
};

const Predictor = () => {
  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const parsedPrediction = useMemo(() => {
    if (!result?.prediction) return null;
    const [giftType = "-", style = "-", container = "-"] = result.prediction.split("|").map((x) => x.trim());
    return { giftType, style, container };
  }, [result]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price_mid" || name === "personality_score" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Prediction failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Could not reach prediction server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-rose-900">AI Gift Predictor</h1>
          <p className="text-gray-600 mt-2">Fill details below to get your model-based gift basket recommendation.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-rose-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["female", "male", "unknown"]} />
            <FieldSelect
              label="Age Group"
              name="age_group"
              value={formData.age_group}
              onChange={handleChange}
              options={["0-1", "1-3", "3-6", "6-9", "9-12", "12-15", "16-20", "20-25", "25-35", "35+", "unknown"]}
            />
            <FieldSelect label="Age Type" name="age_type" value={formData.age_type} onChange={handleChange} options={["kid", "adult", "unknown"]} />
            <FieldSelect
              label="Relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              options={["close family", "extended family", "friend", "spouse", "colleague/professional", "other", "unknown"]}
            />
            <FieldSelect
              label="Occasion"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              options={["birthday", "anniversary", "graduation", "holiday", "thank you gift", "get well soon", "wedding/engagement gift", "other", "unknown"]}
            />
            <FieldSelect
              label="Gift Style"
              name="gift_item_style"
              value={formData.gift_item_style}
              onChange={handleChange}
              options={["handmade & crafted", "quirky & unique", "funny & lighthearted", "unknown"]}
            />
            <FieldSelect
              label="Container Type"
              name="container_type"
              value={formData.container_type}
              onChange={handleChange}
              options={["simple box", "acrylic box", "basket with ribbon", "basket with net", "unknown"]}
            />
            <FieldNumber label="Budget (price_mid)" name="price_mid" value={formData.price_mid} onChange={handleChange} min={0} />
            <FieldNumber label="Personality Score (1-5)" name="personality_score" value={formData.personality_score} onChange={handleChange} min={1} max={5} step={0.1} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl hover:bg-rose-700 disabled:opacity-70 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isLoading ? "Predicting..." : "Get Prediction"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {result && parsedPrediction && (
          <div className="mt-6 bg-white border border-rose-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-rose-900 mb-4">Recommended Basket</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ResultTile title="Gift Type" value={parsedPrediction.giftType} />
              <ResultTile title="Gift Style" value={parsedPrediction.style} />
              <ResultTile title="Container" value={parsedPrediction.container} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FieldSelect = ({ label, name, value, onChange, options }) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-rose-900">{label}</span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-rose-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const FieldNumber = ({ label, name, value, onChange, min, max, step }) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-rose-900">{label}</span>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      className="w-full border border-rose-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
    />
  </label>
);

const ResultTile = ({ title, value }) => (
  <div className="rounded-xl bg-rose-50 border border-rose-100 p-4">
    <p className="text-xs uppercase tracking-wide text-rose-500">{title}</p>
    <p className="text-rose-900 font-semibold mt-1">{value || "-"}</p>
  </div>
);

export default Predictor;
