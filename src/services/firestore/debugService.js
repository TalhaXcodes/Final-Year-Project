import { db, auth } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const debugFirestoreWrite = async () => {
  console.log("🧪 FIRESTORE DEBUG TEST STARTED");
  console.log("📊 Current Firebase Auth User:", auth.currentUser);
  console.log("📊 Firestore DB instance:", db);

  if (!auth.currentUser) {
    console.error("❌ No authenticated user found. Please log in first.");
    return;
  }

  const userId = auth.currentUser.uid;
  console.log("✅ Using User ID:", userId);

  try {
    const testData = {
      displayName: "Test User " + new Date().getTime(),
      email: auth.currentUser.email,
      phoneNumber: "1234567890",
      address: "Test Address",
      city: "Test City",
      postalCode: "12345",
      country: "Test Country",
      provider: "debug-test",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      _debugTest: true,
    };

    console.log("📝 Attempting to write test data to Firestore...");
    console.log("🎯 Target Path: users/" + userId);
    console.log("📊 Test Data:", testData);

    const userRef = doc(db, "users", userId);
    await setDoc(userRef, testData, { merge: true });

    console.log("✅ SUCCESS: Test document written to Firestore!");
    console.log("🎯 You can now check the Firestore console at:");
    console.log("   https://console.firebase.google.com/project/final-year-project-a5669/firestore/data/users/" + userId);
    console.log("");
    console.log("✅ If you see the document in the console, Firestore is working!");
    console.log("⚠️  If you don't see it, check your Firestore Security Rules:");
    console.log("   1. Go to Firebase Console");
    console.log("   2. Navigate to Firestore > Rules");
    console.log("   3. Make sure rules allow writes for authenticated users");
    console.log("   4. Rule should include: allow write: if request.auth != null;");

    return true;
  } catch (error) {
    console.error("❌ FIRESTORE WRITE FAILED");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);

    if (error.code === "permission-denied") {
      console.error("");
      console.error("🔒 SECURITY RULES ISSUE DETECTED");
      console.error("Your Firestore security rules are blocking writes.");
      console.error("");
      console.error("TO FIX:");
      console.error("1. Open Firebase Console: https://console.firebase.google.com");
      console.error("2. Select project: final-year-project-a5669");
      console.error("3. Go to Firestore Database > Rules");
      console.error("4. Replace rules with:");
      console.error("");
      console.error(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Allow read-only access to other collections if needed
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}`);
      console.error("");
      console.error("5. Click 'Publish' to apply rules");
    }

    return false;
  }
};

console.log("🆘 To test Firestore writes, run this in your browser console:");
console.log(">>> import { debugFirestoreWrite } from './services/firestore/debugService';");
console.log(">>> debugFirestoreWrite();");
