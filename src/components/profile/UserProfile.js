import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, updatePassword, EmailAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  updateUserProfile,
  syncAuthProfile,
  getProviderType,
} from "../../services/firestore/profileService";
import { User, Mail, Phone, MapPin, Lock } from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Personal Info State
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("");

  // Shipping Info State
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [savingShipping, setSavingShipping] = useState(false);
  const [shippingMessage, setShippingMessage] = useState("");

  // Security State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  // Auth check and profile fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const profileData = await fetchUserProfile(firebaseUser.uid);
          if (profileData) {
            setProfile(profileData);
            setDisplayName(profileData.displayName || "");
            setPhoneNumber(profileData.phoneNumber || "");
            setAddress(profileData.address || "");
            setCity(profileData.city || "");
            setPostalCode(profileData.postalCode || "");
            setCountry(profileData.country || "");
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          setPersonalMessage("Failed to load profile");
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    setPersonalMessage("");

    if (!displayName.trim()) {
      setPersonalMessage("Display name cannot be empty");
      return;
    }

    if (!user) return;

    try {
      setSavingPersonal(true);

      // Update both Firebase Auth and Firestore
      await syncAuthProfile(user.uid, displayName);

      // Update Firestore with phone
      await updateUserProfile(user.uid, {
        displayName,
        phoneNumber,
      });

      setProfile({ ...profile, displayName, phoneNumber });
      setPersonalMessage("Personal information saved successfully!");
      setTimeout(() => setPersonalMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setPersonalMessage(error.message || "Failed to save personal information");
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveShippingInfo = async (e) => {
    e.preventDefault();
    setShippingMessage("");

    if (!address.trim() || !city.trim() || !postalCode.trim() || !country.trim()) {
      setShippingMessage("All shipping fields are required");
      return;
    }

    if (!user) return;

    try {
      setSavingShipping(true);

      await updateUserProfile(user.uid, {
        address,
        city,
        postalCode,
        country,
      });

      setProfile({ ...profile, address, city, postalCode, country });
      setShippingMessage("Shipping information saved successfully!");
      setTimeout(() => setShippingMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setShippingMessage(error.message || "Failed to save shipping information");
    } finally {
      setSavingShipping(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");

    if (!newPassword) {
      setPasswordMessage("Please enter a new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 64) {
      setPasswordMessage("Password must be between 8 and 64 characters long");
      return;
    }

    if (!user) return;

    try {
      setSavingPassword(true);
      await updatePassword(user, newPassword);
      setPasswordMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setPasswordMessage(error.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const isEmailPasswordUser = user?.providerData?.some(
    (provider) => provider.providerId === EmailAuthProvider.PROVIDER_ID
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const provider = user ? getProviderType(user) : "Unknown";

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4 py-10">
        <div className="bg-white p-8 rounded-xl shadow-md border border-rose-300 w-full max-w-md text-center">
          <div className="w-10 h-10 mx-auto mb-4 rounded-full border-4 border-rose-200 border-t-rose-600 animate-spin" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md border border-rose-300 p-6 mb-6">
          <div className="flex items-center gap-4">
            {user?.displayName && (
              <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center text-2xl font-bold">
                {getInitials(user.displayName)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">
                {user?.displayName || "Profile"}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-sm font-medium rounded-full">
                  {provider}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-xl shadow-md border border-rose-300 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-rose-600">Personal Information</h2>
          </div>

          {personalMessage && (
            <div
              className={`p-4 rounded-lg mb-4 ${personalMessage.includes("success")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >
              {personalMessage}
            </div>
          )}

          <form onSubmit={handleSavePersonalInfo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border border-rose-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Your display name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-rose-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Your phone number"
              />
            </div>

            <button
              type="submit"
              disabled={savingPersonal}
              className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingPersonal ? "Saving..." : "Save Personal Information"}
            </button>
          </form>
        </div>

        {/* Shipping Information Section */}
        <div className="bg-white rounded-xl shadow-md border border-rose-300 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-rose-600">Shipping Information</h2>
          </div>

          {shippingMessage && (
            <div
              className={`p-4 rounded-lg mb-4 ${shippingMessage.includes("success")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >
              {shippingMessage}
            </div>
          )}

          <form onSubmit={handleSaveShippingInfo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-rose-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-rose-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full border border-rose-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="Postal code"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-rose-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Country"
              />
            </div>

            <button
              type="submit"
              disabled={savingShipping}
              className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingShipping ? "Saving..." : "Save Shipping Information"}
            </button>
          </form>
        </div>

        {/* Security Section */}
        {isEmailPasswordUser && (
          <div className="bg-white rounded-xl shadow-md border border-rose-300 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-rose-600" />
              <h2 className="text-xl font-bold text-rose-600">Security</h2>
            </div>

            {passwordMessage && (
              <div
                className={`p-4 rounded-lg mb-4 ${passwordMessage.includes("success")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
                  }`}
              >
                {passwordMessage}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-rose-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="Enter new password"
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be between 8 and 64 characters long.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-rose-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="Confirm new password"
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}

        {!isEmailPasswordUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-sm text-blue-700">
              💡 This account was created using {provider} Sign-In. To change your
              password, please visit your {provider} account settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
