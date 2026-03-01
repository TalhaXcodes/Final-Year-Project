import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, LogIn, Gift, AlertCircle } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!form.email || !form.password) {
            setMessage("Please fill in all fields.");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                setMessage("Please verify your email before logging in.");
                setLoading(false);
                return;
            }

            navigate("/dashboard");
        } catch (error) {
            setMessage(error.message);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setMessage("");
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/dashboard");
        } catch (error) {
            setMessage(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-10 fade-in">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8 justify-center hover:opacity-80 transition">
                        <Gift className="w-10 h-10 text-rose-600" />
                        <span className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">BASKETRIES</span>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600 text-sm md:text-base">Sign in to your account to continue finding perfect gifts</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6 hover:shadow-xl transition-all duration-300">
                    {/* Error Alert */}
                    {message && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded-lg flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full border-2 border-gray-200 p-3 pr-12 rounded-lg focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed transition"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-2 mt-2"
                        >
                            <LogIn className="w-5 h-5" />
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                        {/* Divider */}
                        <div className="relative py-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FcGoogle className="text-xl" />
                            <span className="text-gray-700 font-medium">Continue with Google</span>
                        </button>
                    </form>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;