import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Questionnaire from "./components/questionnaire/Questionnaire";
import UserNavbar from "./components/navbar/UserNavbar";
import About from "./components/pages/About";
import Services from "./components/pages/Services";
import Contact from "./components/pages/Contact";
import Home from "./components/pages/Home";
import ThankYou from "./components/pages/Thankyou";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import UserProfile from "./components/profile/UserProfile";
import Catalogue from "./components/catalogue/Catalogue";
import Shop from "./components/shop/Shop";
import ProductDetails from "./components/shop/ProductDetails";
import Cart from "./components/cart/Cart";
import Checkout from "./components/checkout/Checkout";
import Favourites from "./components/favourites/Favourites";
import RecommendBasket from "./components/pages/RecommendBasket";
import GuestAccess from "./components/pages/GuestAccess";
import OrderSuccess from "./components/pages/OrderSuccess";
import SeedTemplates from "./components/pages/SeedTemplates";

const AdminRoute = ({ children }) => {
  const { loading, isAuthenticated, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const UserRoute = ({ children }) => {
  const { loading, isAuthenticated, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "user") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const QuestionnaireRoute = () => {
  const { user, loading } = useAuth();
  const isGuest = localStorage.getItem("isGuest") === "true";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-rose-600 font-medium">Checking access...</p>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <Navigate to="/guest-access" replace />;
  }

  return <Questionnaire />;
};

function App() {
  return (
    <>
      <UserNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/questionnaire" element={<QuestionnaireRoute />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <UserRoute>
              <UserProfile />
            </UserRoute>
          }
        />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/recommend-basket" element={<RecommendBasket />} />
        <Route path="/guest-access" element={<GuestAccess />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/seed-templates" element={<SeedTemplates />} />
      </Routes>
    </>
  );
}

export default App;
