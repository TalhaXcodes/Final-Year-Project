// Footer.js
import { Gift, Mail, Phone, MapPin, Instagram, } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-rose-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand & Description */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Gift className="w-6 h-6 text-rose-600" />
                            <span className="text-xl font-semibold text-rose-900">BASKETRIES</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Follow us on Instagram for updates, new arrivals, and gift inspirations.
                        </p>
                        <div className="flex gap-3">
                            {/* Invisible placeholders to maintain spacing */}
                            <div className="w-8 h-8"></div>
                            <a href="https://www.instagram.com/_basketries?igsh=NzlwM2NhenVsdzNv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center hover:bg-rose-200 transition-colors">
                                <Instagram className="w-4 h-4 text-rose-600" />
                            </a>
                            <div className="w-8 h-8"></div>

                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-rose-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="text-gray-600 hover:text-rose-600 transition-colors">Home</Link></li>
                            <li><Link to="/shop" className="text-gray-600 hover:text-rose-600 transition-colors">Shop</Link></li>
                            <li><Link to="/about" className="text-gray-600 hover:text-rose-600 transition-colors">About</Link></li>
                            <li><Link to="/contact" className="text-gray-600 hover:text-rose-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-rose-900 mb-4">Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/questionnaire" className="text-gray-600 hover:text-rose-600 transition-colors">AI Gift Finder</Link></li>
                            <li><Link to="/dashboard" className="text-gray-600 hover:text-rose-600 transition-colors">My Dashboard</Link></li>
                            <li className="text-gray-600">Custom Baskets</li>
                            <li className="text-gray-600">Corporate Gifting</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-rose-900 mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-rose-600" />
                                hello@basketries.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-rose-600" />
                                (555) 123-4567
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-rose-600" />
                                Lahore, Pakistan
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Line */}
                <div className="border-t border-rose-100 mt-8 pt-8 text-center text-sm text-gray-600">
                    <p>&copy; 2026 BASKETRIES. All rights reserved. Powered by AI.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;