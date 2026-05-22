import { db } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const ordersRef = collection(db, "orders");

export const createOrder = async (orderData) => {
  return await addDoc(ordersRef, {
    ...orderData,
    status: "pending",
    paymentMethod: "Cash on Delivery",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getUserOrders = async (userId) => {
  const q = query(ordersRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getAllOrders = async () => {
  const snapshot = await getDocs(ordersRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateOrderStatus = async (orderId, status) => {
  const orderRef = doc(db, "orders", orderId);

  return await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};