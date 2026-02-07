import React, { useEffect } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    if (!user) return null;

    // extract name from email
    const displayName = user?.displayName || "User";


    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-rose-50 px-4 py-10">
            <div className="max-w-6xl mx-auto">

                {/* SECTION 1 */}
                <div className="bg-white rounded-xl shadow-md border border-rose-300 p-8 text-center mb-10">
                    <h1 className="text-3xl font-bold text-rose-600 mb-4">
                        Hello {displayName} 👋
                    </h1>

                    <p className="text-gray-600 max-w-xl mx-auto">
                        Start your journey to find the perfect personalized gift using our
                        AI-powered recommendations.
                    </p>
                </div>

                {/* SECTION 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1 */}
                    <div className="bg-white rounded-xl shadow-md border border-rose-300 p-6 text-center flex flex-col">
                        <h2 className="text-xl font-semibold text-rose-600 mb-2">
                            Personality Questionnaire
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Answer a few questions to help our AI understand your preferences.
                        </p>
                        <button
                            onClick={() => navigate("/questionnaire")}
                            className="w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 transition mt-auto"
                        >
                            Start Questionnaire
                        </button>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-xl shadow-md border border-rose-300 p-6 text-center flex flex-col">
                        <h2 className="text-xl font-semibold text-rose-600 mb-2">
                            Gift Recommendations
                        </h2>
                        <p className="text-gray-600 mb-6">
                            View AI-generated gifts tailored for you.
                        </p>
                        <button
                            onClick={() => navigate("/recommendations")}
                            className="w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 transition mt-auto"
                        >
                            View Recommendations
                        </button>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-xl shadow-md border border-rose-300 p-6 text-center flex flex-col">
                        <h2 className="text-xl font-semibold text-rose-600 mb-2">
                            Favourites
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Access gifts you have saved for later.
                        </p>
                        <button
                            onClick={() => navigate("/favourites")}
                            className="w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 transition mt-auto"
                        >
                            View Favourites
                        </button>
                    </div>

                </div>

                {/* Logout */}
                <div className="text-center mt-10">
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-rose-600 underline"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
