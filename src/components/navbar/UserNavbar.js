import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../firebase";

const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <NavLink
            to="/"
            className="text-rose-700 font-bold text-2xl tracking-wide hover:text-rose-600"
          >
            BASKETRIES
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-rose-700 font-semibold"
                  : "text-gray-700 hover:text-rose-600"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/questionnaire"
              className={({ isActive }) =>
                isActive
                  ? "text-rose-700 font-semibold"
                  : "text-gray-700 hover:text-rose-600"
              }
            >
              Questionnaire
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-rose-700 font-semibold"
                  : "text-gray-700 hover:text-rose-600"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive
                  ? "text-rose-700 font-semibold"
                  : "text-gray-700 hover:text-rose-600"
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-rose-700 font-semibold"
                  : "text-gray-700 hover:text-rose-600"
              }
            >
              Contact
            </NavLink>

            {/* Profile Icon */}
            {user && (
              <button
                onClick={() => navigate("/profile")}
                className="text-gray-700 hover:text-rose-600 transition"
              >
                {/* Simple profile SVG icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-rose-700 text-2xl"
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md py-4 flex flex-col items-center space-y-4">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-rose-600"
          >
            Home
          </NavLink>
          <NavLink
            to="/questionnaire"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-rose-600"
          >
            Questionnaire
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-rose-600"
          >
            About
          </NavLink>
          <NavLink
            to="/services"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-rose-600"
          >
            Services
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-rose-600"
          >
            Contact
          </NavLink>
          <NavLink
            to="/catalogue"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-rose-600"
          >
            Catalogue
          </NavLink>

          {/* Profile Icon for Mobile */}
          {user && (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="text-gray-700 hover:text-rose-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
