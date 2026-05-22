import { Routes, Route } from "react-router-dom";
import Questionnaire from "./components/questionnaire/Questionnaire";
import UserNavbar from "./components/navbar/UserNavbar";
import About from "./components/pages/About";
import Services from "./components/pages/Services";
import Contact from "./components/pages/Contact";
import Home from "./components/pages/Home";
import ThankYou from "./components/pages/Thankyou";
import Predictor from "./components/pages/Predictor";
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

function App() {
  return (
    <>
      <UserNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/predict" element={<Predictor />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
    </>
  );
}

export default App;
