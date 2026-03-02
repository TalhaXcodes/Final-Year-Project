import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setMessage("Please fill in all fields.");
      return;
    }
    try {
      const user = await login(form.email, form.password);
      if (!user.emailVerified) {
        setMessage("Please verify your email before logging in.");
        return;
      }
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-rose-300 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-rose-600 mb-6 text-center">Login</h2>

        {message && <p className="text-center text-sm mb-4 text-rose-600">{message}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-rose-300 p-2 rounded-md focus:ring-2 focus:ring-rose-400 outline-none"
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
              className="w-full border border-rose-300 p-2 rounded-md focus:ring-2 focus:ring-rose-400 outline-none pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? "👁️" : "🙈"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 shadow-sm py-2 rounded-md hover:shadow-md transition mt-3"
          >
            <FcGoogle className="text-lg" />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-rose-600 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;