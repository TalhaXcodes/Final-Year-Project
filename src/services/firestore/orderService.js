import { db } from "../../firebase";
import {
  addDoc,
  getDoc,
  collection,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

const ordersRef = collection(db, "orders");

export const createOrder = async (orderData) => {
  const batch = writeBatch(db);

  const newOrderRef = doc(ordersRef);

  batch.set(newOrderRef, {
    ...orderData,
    orderId: newOrderRef.id,
    confirmation: {
      emailSent: false,
      emailStatus: "Pending",
    },
    status: "pending",
    paymentMethod: "Cash on Delivery",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  for (const item of orderData.items) {
    const quantity = Number(item.quantity || 1);

    let itemRef;

    if (item.type === "personalized") {
      const templateId = item.productId.replace("personalized-", "");
      itemRef = doc(db, "personalizedTemplates", templateId);
    } else {
      itemRef = doc(db, "products", item.productId);
    }

    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) {
      throw new Error(`${item.name} no longer exists.`);
    }

    const currentStock = Number(itemSnap.data().stock || 0);

    if (currentStock < quantity) {
      throw new Error(
        `${item.name} has only ${currentStock} item(s) available in stock.`
      );
    }
  }

  orderData.items.forEach((item) => {
    const quantity = Number(item.quantity || 1);

    if (item.type === "personalized") {
      const templateId = item.productId.replace("personalized-", "");
      const templateRef = doc(db, "personalizedTemplates", templateId);

      batch.update(templateRef, {
        stock: increment(-quantity),
        updatedAt: serverTimestamp(),
      });
    } else {
      const productRef = doc(db, "products", item.productId);

      batch.update(productRef, {
        stock: increment(-quantity),
        updatedAt: serverTimestamp(),
      });
    }
  });

  await batch.commit();

  return newOrderRef.id;
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
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    throw new Error("Order not found");
  }

  const orderData = orderSnap.data();
  const batch = writeBatch(db);

  batch.update(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });

  if (status === "cancelled" && !orderData.inventoryRestored) {
    orderData.items?.forEach((item) => {
      const quantity = Number(item.quantity || 1);

      if (item.type === "personalized") {
        const templateId = item.productId.replace("personalized-", "");
        const templateRef = doc(db, "personalizedTemplates", templateId);

        batch.update(templateRef, {
          stock: increment(quantity),
          updatedAt: serverTimestamp(),
        });
      } else {
        const productRef = doc(db, "products", item.productId);

        batch.update(productRef, {
          stock: increment(quantity),
          updatedAt: serverTimestamp(),
        });
      }
    });

    batch.update(orderRef, {
      inventoryRestored: true,
      updatedAt: serverTimestamp(),
    });
  }

  return await batch.commit();
};