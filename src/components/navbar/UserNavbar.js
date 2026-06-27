import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  ShoppingCart,
  Heart,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  const {
    user,
    role,
    isAuthenticated,
    logout,
  } = useAuth();

  const {
    favorites,
    getCartCount,
  } = useCart();

  const cartCount = getCartCount();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-rose-100 text-rose-700"
        : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md border-b border-rose-100"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-rose-600" />
            <span className="text-2xl font-bold text-rose-900">
              Basketries
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">

            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-rose-600 transition" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Favourites */}
            {isAuthenticated && (
              <Link
                to="/favourites"
                className="relative"
              >
                <Heart className="w-5 h-5 text-gray-700 hover:text-rose-600 transition" />

                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative group">

                <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 transition">
                  <User className="w-5 h-5 text-rose-600" />

                  <span className="font-medium text-gray-700">
                    {user?.displayName || "User"}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white border border-rose-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-rose-50"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>

                  {role === "user" && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-rose-50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}

                  {role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-rose-50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-rose-50 w-full text-left rounded-b-2xl"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>

                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 transition"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
          >
            {open ? (
              <X className="w-6 h-6 text-rose-700" />
            ) : (
              <Menu className="w-6 h-6 text-rose-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-4 bg-white rounded-2xl border border-rose-100 shadow-lg p-4 flex flex-col gap-3">

            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                >
                  Cart ({cartCount})
                </Link>

                <Link
                  to="/favourites"
                  onClick={() => setOpen(false)}
                >
                  Favourites
                </Link>

                {role === "user" && (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                {role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-left text-red-500"
                >
                  Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;