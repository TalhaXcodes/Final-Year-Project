import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { Menu, X, Gift, LogOut, User, LayoutDashboard, LogIn } from "lucide-react";

const UserNavbar = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    const navLinks = [
        { label: "Home", path: "/home", icon: null },
        { label: "Questionnaire", path: "/questionnaire", icon: null },
        { label: "Catalogue", path: "/catalogue", icon: null },
        { label: "About", path: "/about", icon: null },
        { label: "Services", path: "/services", icon: null },
        { label: "Contact", path: "/contact", icon: null },
    ];

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition">
                        <Gift className="w-8 h-8 text-rose-600" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent hidden sm:inline">BASKETRIES</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-700 hover:text-rose-600 font-medium transition-colors duration-300 text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <User className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-gray-700">Profile</span>
                        </Link>
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <LayoutDashboard className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-gray-700">Dashboard</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-600" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="my-2" />
                        <Link
                            to="/profile"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <User className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700">Profile</span>
                        </Link>
                        <Link
                            to="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <LayoutDashboard className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700">Dashboard</span>
                        </Link>
                        <button
                            onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default UserNavbar;