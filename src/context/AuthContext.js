import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { initializeUserProfile } from "../services/firestore/profileService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("👤 AuthContext: User logged in/signed up:", currentUser.uid);

        setUser(currentUser);
        setIsAuthenticated(true);
        setLoading(false);

        try {
          console.log("🔄 AuthContext: Attempting to initialize user profile...");
          await initializeUserProfile(currentUser.uid, currentUser);
          console.log("✅ AuthContext: User profile initialized successfully");
        } catch (error) {
          console.error("❌ AuthContext: Failed to initialize user profile:", {
            uid: currentUser.uid,
            error: error.message,
            code: error.code,
          });
        }
      } else {
        console.log("👤 AuthContext: User logged out");

        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Email & Password Login
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      throw new Error("Please verify your email before logging in.");
    }
    return userCredential.user;
  };

  // Google Login
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);