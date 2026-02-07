import { Routes, Route } from "react-router-dom";
import Questionnaire from "./components/questionnaire/Questionnaire";
import UserNavbar from "./components/navbar/UserNavbar";
import About from "./components/pages/About";
import Services from "./components/pages/Services";
import Contact from "./components/pages/Contact";
import Home from "./components/pages/Home";
import ThankYou from "./components/pages/Thankyou";
import LandingPage from "./components/pages/LandingPage";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import UserProfile from "./components/profile/UserProfile";

function App() {
  return (
    <>
      {/* Navbar will NOT show on landing page */}
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/*"
          element={
            <>
              <UserNavbar />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/profile" element={<UserProfile />} />


              </Routes>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
