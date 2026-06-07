import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

const initialForm = {
  name: "",
  category: "Accessories",
  gender: "Female",
  ageGroups: "",
  occasionTags: "",
  styleTags: "",
  traitTags: "",
  baseItem: "",
  includedItems: "",
  availableAddons: "",
  price: "",
  stock: "",
  description: "",
  recommendationReason: "",
  imageUrl: "",
  isAvailable: true,
  isFeatured: false,
  type: "personalized",
};

const SeedTemplates = () => {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const categories = [
    "Accessories",
    "Bag / Wallet",
    "Clothing",
    "Edible Stuff",
    "Makeup Products",
    "Perfume",
    "Shoes",
    "Toys",
  ];

  const genders = ["Female", "Male", "Unisex"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const parseAddons = (value) => {
    // Format: Flowers:500, Cake:1200, Teddy Bear:800
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [name, price] = item.split(":").map((part) => part.trim());

        return {
          name,
          price: Number(price || 0),
        };
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.baseItem || !form.price || !form.stock) {
      setMessage("Please fill name, base item, price and stock.");
      return;
    }

    try {
      setSaving(true);

      const template = {
        name: form.name,
        category: form.category,
        gender: form.gender,

        ageGroups: toArray(form.ageGroups),
        occasionTags: toArray(form.occasionTags),
        styleTags: toArray(form.styleTags),
        traitTags: toArray(form.traitTags),

        baseItem: form.baseItem,
        includedItems: toArray(form.includedItems),
        availableAddons: parseAddons(form.availableAddons),

        price: Number(form.price),
        stock: Number(form.stock),

        description: form.description,
        recommendationReason: form.recommendationReason,
        imageUrl: form.imageUrl,

        isAvailable: form.isAvailable,
        isFeatured: form.isFeatured,
        type: "personalized",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "personalizedTemplates"), template);

      setMessage("Template added successfully!");
      setForm(initialForm);
    } catch (error) {
      console.error("Template add error:", error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white border border-rose-200 rounded-3xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-rose-700 mb-2">
          Add Personalized Template
        </h1>

        <p className="text-gray-500 mb-6">
          Enter template metadata and save it directly to Firestore.
        </p>

        {message && (
          <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Template Name"
              className="border border-rose-200 p-3 rounded-xl"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border border-rose-200 p-3 rounded-xl"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="border border-rose-200 p-3 rounded-xl"
            >
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>

            <input
              name="baseItem"
              value={form.baseItem}
              onChange={handleChange}
              placeholder="Base Item e.g. Bracelet"
              className="border border-rose-200 p-3 rounded-xl"
            />

            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Base Price"
              className="border border-rose-200 p-3 rounded-xl"
            />

            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="border border-rose-200 p-3 rounded-xl"
            />
          </div>

          <textarea
            name="ageGroups"
            value={form.ageGroups}
            onChange={handleChange}
            placeholder="Age Groups comma separated e.g. 16–20, 20–25, 25–35"
            className="w-full border border-rose-200 p-3 rounded-xl min-h-20"
          />

          <textarea
            name="occasionTags"
            value={form.occasionTags}
            onChange={handleChange}
            placeholder="Occasions comma separated e.g. Birthday, Anniversary, Holiday"
            className="w-full border border-rose-200 p-3 rounded-xl min-h-20"
          />

          <textarea
            name="styleTags"
            value={form.styleTags}
            onChange={handleChange}
            placeholder="Style Tags comma separated e.g. Elegant, Romantic, Luxury"
            className="w-full border border-rose-200 p-3 rounded-xl min-h-20"
          />

          <textarea
            name="traitTags"
            value={form.traitTags}
            onChange={handleChange}
            placeholder="Trait Tags comma separated e.g. Sentimental, Style-Conscious"
            className="w-full border border-rose-200 p-3 rounded-xl min-h-20"
          />

          <textarea
            name="includedItems"
            value={form.includedItems}
            onChange={handleChange}
            placeholder="Included Items comma separated e.g. Bracelet, Flowers, Greeting Card"
            className="w-full border border-rose-200 p-3 rounded-xl min-h-20"
          />

          <textarea
            name="availableAddons"
            value={form.availableAddons}
            onChange={handleChange}
            placeholder="Available Addons format: Chocolates:500, Cake:1200, Teddy Bear:800"
            className="w-full border border-rose-200 p-3 rounded-xl min-h-20"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Template Description"
            className="w-full border border-rose-200 p-3 rounded-xl min-h-24"
          />

          <textarea
            name="recommendationReason"
            value={form.recommendationReason}
            onChange={handleChange}
            placeholder="Why this fits you explanation"
            className="w-full border border-rose-200 p-3 rounded-xl min-h-24"
          />

          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border border-rose-200 p-3 rounded-xl"
          />

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                className="accent-rose-600"
              />
              Available
            </label>

            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="accent-rose-600"
              />
              Featured
            </label>
          </div>

          <button
            disabled={saving}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold"
          >
            {saving ? "Saving..." : "Save Template"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SeedTemplates;