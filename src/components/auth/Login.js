import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      await login(form.email.trim(), form.password);

      localStorage.removeItem("isGuest");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setMessage("");

      await loginWithGoogle();

      localStorage.removeItem("isGuest");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Google login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-rose-300 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-rose-600 mb-6 text-center">
          Login
        </h2>

        {message && (
          <p className="text-center text-sm mb-4 text-rose-600">
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
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
              autoComplete="current-password"
              spellCheck="false"
              required
              disabled={isSubmitting}
              className="w-full border border-rose-300 p-2 rounded-md focus:ring-2 focus:ring-rose-400 outline-none pr-10 disabled:bg-gray-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isSubmitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition disabled:bg-rose-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 shadow-sm py-2 rounded-md hover:shadow-md transition mt-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-lg" />
            <span className="text-gray-700 font-medium">
              {isSubmitting ? "Please wait..." : "Continue with Google"}
            </span>
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-rose-600 cursor-pointer hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;