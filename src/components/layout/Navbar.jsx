import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/images/MainStage222Logo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 bg-white shadow-sm z-50">
            <nav className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src={logo}
                            alt="Stage222 Logo"
                            className="h-12 w-auto"
                            draggable="false"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-[#00A55F] font-medium transition-colors">
                            Home
                        </Link>
                        <Link to="/internships" className="text-gray-700 hover:text-[#00A55F] font-medium transition-colors">
                            Internships
                        </Link>
                        <Link to="/jobs" className="text-gray-700 hover:text-[#00A55F] font-medium transition-colors">
                            Jobs
                        </Link>
                        <Link to="/login" className="text-gray-700 hover:text-[#00A55F] font-medium transition-colors">
                            Login
                        </Link>
                        <Link to="/register/student" className="bg-[#00A55F] text-white px-4 py-2 rounded-md hover:bg-[#008c4f] transition-colors">
                            Register as Student
                        </Link>
                        <Link to="/register/employer" className="text-gray-700 hover:text-[#00A55F] font-medium transition-colors">
                            For Employers
                        </Link>
                        {/* Test Links */}
                        <Link to="/verify-otp" className="text-gray-700 hover:text-[#00A55F] font-medium transition-colors">
                            Test OTP
                        </Link>
                        <Link to="/reset-password" className="text-gray-700 hover:text-[#00A55F] font-medium transition-colors">
                            Test Reset
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-700 hover:text-[#00A55F] transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 space-y-4 pb-4">
                        <Link
                            to="/"
                            className="block text-gray-700 hover:text-[#00A55F] font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/internships"
                            className="block text-gray-700 hover:text-[#00A55F] font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Internships
                        </Link>
                        <Link
                            to="/jobs"
                            className="block text-gray-700 hover:text-[#00A55F] font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Jobs
                        </Link>
                        <Link
                            to="/login"
                            className="block text-gray-700 hover:text-[#00A55F] font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register/student"
                            className="block bg-[#00A55F] text-white px-4 py-2 rounded-md hover:bg-[#008c4f] transition-colors text-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Register as Student
                        </Link>
                        <Link
                            to="/register/employer"
                            className="block text-gray-700 hover:text-[#00A55F] font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            For Employers
                        </Link>
                        {/* Test Links */}
                        <Link
                            to="/verify-otp"
                            className="block text-gray-700 hover:text-[#00A55F] font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Test OTP
                        </Link>
                        <Link
                            to="/reset-password"
                            className="block text-gray-700 hover:text-[#00A55F] font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Test Reset
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar; 