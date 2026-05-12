import { db, auth } from "../../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const USERS_COLLECTION = "users";

export const getProviderType = (authUser) => {
  if (!authUser?.providerData) return "unknown";

  const providers = authUser.providerData.map((p) => p.providerId);

  if (providers.includes("google.com")) {
    return "Google";
  }
  if (providers.includes("password")) {
    return "Email";
  }

  return providers[0] || "unknown";
};

export const initializeUserProfile = async (userId, authUser) => {
  try {
    if (!userId || !authUser) {
      console.warn("❌ initializeUserProfile: Missing userId or authUser", { userId, authUser });
      return null;
    }

    console.log("🔍 initializeUserProfile: Checking for existing profile for user:", userId);

    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnapshot = await getDoc(userRef);

    // Profile already exists, don't overwrite
    if (userSnapshot.exists()) {
      console.log("✅ initializeUserProfile: Profile already exists for user:", userId);
      console.log("📄 Existing profile data:", userSnapshot.data());
      return userSnapshot.data();
    }

    // Create new profile
    const provider = getProviderType(authUser);
    const profileData = {
      displayName: authUser.displayName || "",
      email: authUser.email || "",
      phoneNumber: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      provider,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log("📝 initializeUserProfile: Creating new profile for user:", userId);
    console.log("📊 Profile data to be written:", {
      displayName: profileData.displayName,
      email: profileData.email,
      provider: profileData.provider,
      phoneNumber: profileData.phoneNumber,
      address: profileData.address,
      city: profileData.city,
      postalCode: profileData.postalCode,
      country: profileData.country,
    });

    // Write to Firestore with merge: true to ensure no overwrites
    await setDoc(userRef, profileData, { merge: true });

    console.log("✅ SUCCESS: Profile document created in Firestore for user:", userId);
    console.log("🎯 Firestore Path: users/" + userId);
    return profileData;
  } catch (error) {
    console.error("❌ ERROR initializing user profile:", {
      userId,
      errorMessage: error.message,
      errorCode: error.code,
      fullError: error,
    });
    throw error;
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    if (!userId) {
      console.warn("❌ fetchUserProfile: Missing userId");
      return null;
    }

    console.log("🔍 fetchUserProfile: Fetching profile for user:", userId);

    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      console.log("⚠️  fetchUserProfile: Profile document doesn't exist yet for user:", userId);
      return null;
    }

    console.log("✅ fetchUserProfile: Profile found for user:", userId);
    console.log("📄 Profile data:", userSnapshot.data());
    return userSnapshot.data();
  } catch (error) {
    console.error("❌ ERROR fetching user profile:", {
      userId,
      errorMessage: error.message,
      errorCode: error.code,
      fullError: error,
    });
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    if (!userId) {
      console.warn("❌ updateUserProfile: Missing userId");
      return null;
    }

    console.log("📝 updateUserProfile: Updating profile for user:", userId);
    console.log("📊 Update data:", profileData);

    const userRef = doc(db, USERS_COLLECTION, userId);

    const updateData = {
      ...profileData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, updateData);

    console.log("✅ SUCCESS: Profile updated for user:", userId);
    console.log("🎯 Firestore Path: users/" + userId);
    return updateData;
  } catch (error) {
    console.error("❌ ERROR updating user profile:", {
      userId,
      errorMessage: error.message,
      errorCode: error.code,
      fullError: error,
    });
    throw error;
  }
};

export const syncAuthProfile = async (userId, displayName) => {
  try {
    if (!auth.currentUser) {
      console.error("❌ syncAuthProfile: No authenticated user found");
      throw new Error("No authenticated user found");
    }

    console.log("🔄 syncAuthProfile: Syncing displayName for user:", userId);
    console.log("📝 New displayName:", displayName);

    // Update Firebase Auth
    await updateProfile(auth.currentUser, { displayName });
    console.log("✅ Firebase Auth updated for user:", userId);

    // Update Firestore
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      displayName,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ SUCCESS: Firestore synced for user:", userId);
    console.log("🎯 Firestore Path: users/" + userId);
    return true;
  } catch (error) {
    console.error("❌ ERROR syncing auth profile:", {
      userId,
      errorMessage: error.message,
      errorCode: error.code,
      fullError: error,
    });
    throw error;
  }
};
