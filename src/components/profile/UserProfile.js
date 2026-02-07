import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { updateProfile, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
    else setDisplayName(user.displayName || "");
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      if (!displayName.trim()) {
        setMessage("Display name cannot be empty.");
        return;
      }

      await updateProfile(user, { displayName });
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      if (!newPassword) {
        setMessage("Enter a new password.");
        return;
      }
      await updatePassword(user, newPassword);
      setMessage("Password updated successfully!");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // Determine if user signed up with email/password
  const isEmailPasswordUser = user?.providerData[0]?.providerId === "password";

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow-md border border-rose-300 w-full max-w-md">

        <h1 className="text-2xl font-bold text-rose-600 mb-6 text-center">
          User Profile
        </h1>

        {message && (
          <p className="text-sm text-green-600 mb-4 text-center">{message}</p>
        )}

        {/* Update Display Name */}
        <form onSubmit={handleUpdateProfile} className="mb-6">
          <label className="block text-gray-700 mb-2">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-rose-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition"
          >
            Update Profile
          </button>
        </form>

        {/* Change Password */}
        {isEmailPasswordUser ? (
          <form onSubmit={handleChangePassword}>
            <label className="block text-gray-700 mb-2">Change Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-rose-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition"
            >
              Change Password
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500 mb-4">
            Your account is linked with Google. Password cannot be changed here.
          </p>
        )}

      </div>
    </div>
  );
}
