import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm: ""
    });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    // Regex to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.name || !form.email || !form.password || !form.confirm) {
            setMessage("Please fill in all fields.");
            return;
        }

        if (!emailRegex.test(form.email)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        if (form.password !== form.confirm) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            // Create user
            const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);

            // Set display name
            await updateProfile(userCred.user, { displayName: form.name });

            // Send email verification
            await sendEmailVerification(userCred.user);

            setMessage("Account created! Please check your email to verify your account.");

            // Optionally redirect to login after delay
            setTimeout(() => navigate("/login"), 3000);

        } catch (error) {
            setMessage(error.message);
        }
    };

    // Google Signup
    const handleGoogleSignup = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/home");
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-rose-50 px-4">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-rose-300 w-full max-w-md">

                <h2 className="text-2xl font-semibold text-rose-600 mb-6 text-center">
                    Create Account
                </h2>

                {message && <p className="text-center text-sm mb-4 text-rose-600">{message}</p>}

                <form onSubmit={handleSignup} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-rose-300 p-2 rounded-md focus:ring-2 focus:ring-rose-400 outline-none"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-rose-300 p-2 rounded-md focus:ring-2 focus:ring-rose-400 outline-none"
                    />

                    {/* Password Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"   // Prevent browser suggestions
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

                    {/* Confirm Password Field */}
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
                            className="w-full border border-rose-300 p-2 rounded-md focus:ring-2 focus:ring-rose-400 outline-none pr-10"
                        />
                        <span
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        >
                            {showConfirm ? "👁️" : "🙈"}
                        </span>
                    </div>



                    <button
                        type="submit"
                        className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition"
                    >
                        Register
                    </button>

                    {/* Google Signup */}
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 shadow-sm py-2 rounded-md hover:shadow-md transition mt-3"
                    >
                        <FcGoogle className="text-lg" />
                        <span className="text-gray-700 font-medium">Continue with Google</span>
                    </button>
                </form>

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")} className="text-rose-600 cursor-pointer hover:underline">
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Signup;
