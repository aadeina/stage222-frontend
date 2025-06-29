import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '@/assets/images/Stage222RecuiterLogo.png';
import { useAuth } from '../../../context/AuthContext';
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaBriefcase, FaPlus, FaCreditCard, FaChartBar } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const RecruiterHeader = ({ title, subtitle }) => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [organizationName, setOrganizationName] = useState('');
    const [isLoadingOrg, setIsLoadingOrg] = useState(true);
    const menuRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    // Navigation items
    const navigationItems = [
        { name: 'Dashboard', path: '/recruiter/dashboard', icon: FaChartBar },
        { name: 'Post Job/Internship', path: '/recruiter/post-opportunity', icon: FaPlus },
        { name: 'Plans and Pricing', path: '/recruiter/pricing', icon: FaCreditCard },
    ];

    // Fetch organization name
    useEffect(() => {
        fetchOrganizationName();
    }, []);

    const fetchOrganizationName = async () => {
        try {
            const response = await api.get('/recruiters/me/');
            const recruiterData = response.data.data || response.data;

            if (recruiterData?.organization) {
                // Fetch organization details
                const orgResponse = await api.get(`/organizations/${recruiterData.organization}/`);
                const orgData = orgResponse.data.data || orgResponse.data;
                setOrganizationName(orgData.name || 'Your Organization');
            } else {
                setOrganizationName('Your Organization');
            }
        } catch (error) {
            console.error('Error fetching organization name:', error);
            setOrganizationName('Your Organization');
        } finally {
            setIsLoadingOrg(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">

                            <img
                                src={logo}
                                alt="Stage222RecuiterLogo"
                                className="h-12 w-auto"
                                draggable="false"
                            />

                            <div className="hidden sm:block">
                                {/* <h1 className="text-xl font-bold text-gray-900">Stage222</h1> */}
                                {/* <p className="text-xs text-gray-500">For Employers</p> */}
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActiveRoute(item.path)
                                            ? 'bg-[#00A55F] text-white'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-[#00A55F]'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* User Menu and Mobile Toggle */}
                    <div className="flex items-center space-x-4">
                        {/* User Info */}
                        <div className="hidden sm:flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.first_name || 'Recruiter'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {isLoadingOrg ? (
                                        <span className="inline-flex items-center">
                                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Loading...
                                        </span>
                                    ) : (
                                        organizationName
                                    )}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-[#00A55F] rounded-full flex items-center justify-center">
                                <FaUser className="h-4 w-4 text-white" />
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <FaSignOutAlt className="h-4 w-4" />
                            <span>Logout</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            {menuOpen ? (
                                <FaTimes className="h-5 w-5" />
                            ) : (
                                <FaBars className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden border-t border-gray-200"
                        >
                            <div className="py-4 space-y-2">
                                {/* Mobile Navigation Items */}
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={() => handleNavigation(item.path)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActiveRoute(item.path)
                                                ? 'bg-[#00A55F] text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span>{item.name}</span>
                                        </button>
                                    );
                                })}

                                {/* Mobile User Info */}
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex items-center space-x-3 px-4 py-2">
                                        <div className="w-8 h-8 bg-[#00A55F] rounded-full flex items-center justify-center">
                                            <FaUser className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user?.first_name || 'Recruiter'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {isLoadingOrg ? 'Loading...' : organizationName}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <FaSignOutAlt className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default RecruiterHeader; 