import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const productsRef = collection(db, "products");

export const updateProduct = async (productId, productData) => {
  const productRef = doc(db, "products", productId);

  return await updateDoc(productRef, {
    name: productData.name,
    category: productData.category,
    price: Number(productData.price),
    stock: Number(productData.stock),
    gender: productData.gender,
    ageGroups: toArray(productData.ageGroups),
    imageUrl: productData.imageUrl,
    description: productData.description,
    tags: toArray(productData.tags),
    isAvailable: productData.isAvailable,
    isFeatured: productData.isFeatured,
    type: "catalogue",
    updatedAt: serverTimestamp(),
  });
};

const toArray = (value = "") =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

export const getAllProducts = async () => {
  const snapshot = await getDocs(productsRef);

  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log("All products:", products);

  return products.filter(
    (product) =>
      product.isAvailable === true &&
      product.type === "catalogue"
  );
};

export const getAdminProducts = async () => {
  const snapshot = await getDocs(productsRef);

  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log("Admin products:", products);

  return products;
};

export const getProductById = async (productId) => {
  const productRef = doc(db, "products", productId);
  const snapshot = await getDoc(productRef);

  if (!snapshot.exists()) {
    throw new Error("Product not found");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const addProduct = async (productData) => {
  return await addDoc(productsRef, {
    name: productData.name,
    category: productData.category,
    price: Number(productData.price),
    stock: Number(productData.stock),
    gender: productData.gender,
    ageGroups: toArray(productData.ageGroups),
    imageUrl: productData.imageUrl,
    description: productData.description,
    tags: toArray(productData.tags),
    isAvailable: productData.isAvailable,
    isFeatured: productData.isFeatured,
    type: "catalogue",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (productId) => {
  return await deleteDoc(doc(db, "products", productId));
};