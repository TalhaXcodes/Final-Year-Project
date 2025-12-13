import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJbd2qGYdDhQeBvlJJxbetr4yRSEy1ops",
  authDomain: "final-year-project-a5669.firebaseapp.com",
  projectId: "final-year-project-a5669",
  storageBucket: "final-year-project-a5669.firebasestorage.app",
  messagingSenderId: "510285521548",
  appId: "1:510285521548:web:7be1e420f349dbdcf151a9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);