import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { initializeUserProfile } from "../services/firestore/profileService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        // User logged in and verified
        if (currentUser && currentUser.emailVerified) {
          console.log("👤 User authenticated:", currentUser.uid);

          setUser(currentUser);
          setIsAuthenticated(true);

          // Fetch role from Firestore
          try {
            const userDoc = await getDoc(
              doc(db, "users", currentUser.uid)
            );

            if (userDoc.exists()) {
              setRole(userDoc.data().role || "user");
            } else {
              console.warn("⚠️ User document not found");
              setRole("user");
            }
          } catch (roleError) {
            console.error("❌ Role fetch failed:", roleError);
            setRole("user");
          }

          // Initialize profile
          try {
            await initializeUserProfile(
              currentUser.uid,
              currentUser
            );
          } catch (profileError) {
            console.error(
              "❌ Profile initialization failed:",
              profileError
            );
          }
        }

        // User exists but email not verified
        else if (currentUser && !currentUser.emailVerified) {
          console.log("⚠️ Email not verified");

          await signOut(auth);

          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
        }

        // No user
        else {
          console.log("👤 User logged out");

          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth error:", error);

        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Email Login
  const login = async (email, password) => {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error(
        "Please verify your email before logging in."
      );
    }

    localStorage.removeItem("isGuest");

    return userCredential.user;
  };

  // Google Login (optional - remove later if not needed)
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    localStorage.removeItem("isGuest");

    return result.user;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);

    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);