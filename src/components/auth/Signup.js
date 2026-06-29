import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email || !form.password || !form.confirm) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 8 || form.password.length > 64) {
      setMessage("Password must be between 8 and 64 characters long.");
      return;
    }

    if (form.password !== form.confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        form.password
      );

      await updateProfile(userCred.user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", userCred.user.uid), {
        name,
        email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      await sendEmailVerification(userCred.user);

      await signOut(auth);

      setSuccess(true);
      setMessage(
        "Verification email sent. Please verify your email, then login."
      );

      setForm({
        name: "",
        email: "",
        password: "",
        confirm: "",
      });
    } catch (error) {
      setSuccess(false);
      setMessage(error.message || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-rose-300 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-rose-600 mb-2 text-center">
          Create Account
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Sign up with your email and verify your account before logging in.
        </p>

        {message && (
          <p
            className={`text-center text-sm mb-4 ${success ? "text-green-600" : "text-rose-600"
              }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full border border-rose-300 p-2 rounded-md focus:ring-2 focus:ring-rose-400 outline-none disabled:bg-gray-100"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full border border-rose-300 p-2 rounded-md focus:ring-2 focus:ring-rose-400 outline-none disabled:bg-gray-100"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              spellCheck="false"
              required
              disabled={isSubmitting}
              className="w-full border border-rose-300 p-2 rounded-md focus:ring-2 focus:ring-rose-400 outline-none pr-10 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be between 8 and 64 characters long.
            </p>

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isSubmitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={handleChange}
              autoComplete="new-password"
              spellCheck="false"
              required
              disabled={isSubmitting}
              className="w-full border border-rose-300 p-2 rounded-md focus:ring-2 focus:ring-rose-400 outline-none pr-10 disabled:bg-gray-100"
            />

            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              disabled={isSubmitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirm ? "👁️" : "🙈"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition disabled:bg-rose-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {success && (
          <button
            onClick={() => navigate("/login")}
            className="w-full mt-4 border border-rose-300 text-rose-600 py-2 rounded-md hover:bg-rose-50 transition"
          >
            Go to Login
          </button>
        )}

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-rose-600 cursor-pointer hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;