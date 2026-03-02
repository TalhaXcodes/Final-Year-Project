import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ShoppingCart, Heart, User, LayoutDashboard, LogOut } from "lucide-react";

const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useCart();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => window.location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-rose-900">BASKETRIES</span>
            </Link>
          </div>

          {/* Center: Pages */}
          <div className="hidden md:flex space-x-6 mx-auto">
            <NavLink
              to="/"
              className={isActive("/") ? "text-rose-600 font-semibold" : "text-gray-700 hover:text-rose-600"}
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={isActive("/shop") ? "text-rose-600 font-semibold" : "text-gray-700 hover:text-rose-600"}
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className={isActive("/about") ? "text-rose-600 font-semibold" : "text-gray-700 hover:text-rose-600"}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={isActive("/contact") ? "text-rose-600 font-semibold" : "text-gray-700 hover:text-rose-600"}
            >
              Contact
            </NavLink>
          </div>

          {/* Right: Cart, Favourites, Profile */}
          <div className="flex items-center gap-4 relative">
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

            {/* Profile Dropdown */}
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-2xl text-rose-700 ml-2"
              onClick={() => setOpen(!open)}
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-white shadow-md py-4 flex flex-col items-center space-y-4">
            <NavLink to="/" onClick={() => setOpen(false)} className="text-gray-700 hover:text-rose-600">
              Home
            </NavLink>
            <NavLink to="/shop" onClick={() => setOpen(false)} className="text-gray-700 hover:text-rose-600">
              Shop
            </NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)} className="text-gray-700 hover:text-rose-600">
              About
            </NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)} className="text-gray-700 hover:text-rose-600">
              Contact
            </NavLink>

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