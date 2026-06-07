import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const GuestAccess = () => {
  const navigate = useNavigate();

  const handleGuestStart = () => {
    localStorage.setItem("isGuest", "true");
    navigate("/questionnaire");
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
      <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-lg border border-rose-200 text-center">
        <h1 className="text-3xl font-bold text-rose-900 mb-4">
          Continue as Guest
        </h1>

        <p className="text-gray-600 mb-6">
          You can access the questionnaire without creating an account.
          However, checkout will require login or registration.
        </p>

        <button
          onClick={handleGuestStart}
          className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-3 rounded-xl hover:bg-rose-700 transition"
        >
          Start as Guest
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GuestAccess;