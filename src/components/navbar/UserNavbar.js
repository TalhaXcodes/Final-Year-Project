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
} from "lucide-react";

const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useCart();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "text-rose-700 bg-rose-100"
        : "text-gray-700 hover:text-rose-600 hover:bg-rose-50"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md bg-white/70 shadow-md border-b border-rose-100"
          : "bg-white/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600" />
            <span className="text-2xl font-semibold tracking-tight text-rose-900">Basketries</span>
          </Link>

          {/* Right: Desktop Links + CTA + Utility Icons */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-x-2 lg:gap-x-3">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            <Link
              to="/predict"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-rose-600 text-white shadow-md hover:scale-105 hover:shadow-lg hover:bg-rose-700 transition-all duration-300"
            >
              Try Now
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-rose-600 transition-colors" />
            </Link>

            {isAuthenticated && (
              <Link to="/favourites" className="relative">
                <Heart className="w-5 h-5 text-gray-700 hover:text-rose-600 transition-colors" />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-700 hover:text-rose-600 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden lg:block">{user?.displayName || user?.name || "User"}</span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-rose-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 rounded-t-xl"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 rounded-b-xl w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-3 rounded-2xl border border-rose-100 bg-white/95 backdrop-blur-md shadow-md p-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}

            <Link
              to="/predict"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
            >
              Try Now
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/cart" onClick={() => setOpen(false)} className="text-gray-700 hover:text-rose-600">
                  Cart
                </Link>
                <Link to="/favourites" onClick={() => setOpen(false)} className="text-gray-700 hover:text-rose-600">
                  Favourites
                </Link>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="text-gray-700 hover:text-rose-600">
                  Dashboard
                </Link>
                {user?.isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="text-gray-700 hover:text-rose-600">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="text-gray-700 hover:text-rose-600 w-full text-left px-2"
                >
                  Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <button
                onClick={() => { setOpen(false); navigate("/login"); }}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;