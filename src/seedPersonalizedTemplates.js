import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const templates = [
  {
    name: "Elegant Bracelet Gift Basket",
    category: "Accessories",
    gender: "Female",
    ageGroups: ["16–20", "20–25", "25–35"],
    occasionTags: ["Birthday", "Anniversary", "Holiday"],
    styleTags: ["Elegant", "Romantic", "Fashion"],
    traitTags: ["Sentimental", "Style-Conscious"],

    baseItem: "Bracelet",
    includedItems: ["Bracelet", "Flowers", "Greeting Card"],

    availableAddons: [
      { name: "Chocolates", price: 500 },
      { name: "Cake", price: 1200 },
      { name: "Teddy Bear", price: 800 },
      { name: "Perfume", price: 2500 },
    ],

    price: 4500,
    stock: 10,

    description:
      "A stylish bracelet basket paired with flowers and a greeting card.",
    recommendationReason:
      "This basket fits because it matches an elegant accessory-based gifting style for female recipients and works well for thoughtful occasions.",

    imageUrl: "PASTE_IMAGE_URL_HERE",

    isAvailable: true,
    isFeatured: false,
    type: "personalized",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
];

export const seedPersonalizedTemplates = async () => {
  try {
    const templatesRef = collection(db, "personalizedTemplates");

    for (const template of templates) {
      await addDoc(templatesRef, template);
      console.log("Template added:", template.name);
    }

    console.log("All templates added successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
};