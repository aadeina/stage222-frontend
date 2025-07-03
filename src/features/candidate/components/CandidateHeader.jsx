import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBell,
    FaEnvelope,
    FaUser,
    FaHome,
    FaFileAlt,
    FaBookmark,
    FaEdit,
    FaCog,
    FaShieldAlt,
    FaQuestionCircle,
    FaEllipsisH,
    FaUserCog,
    FaSignOutAlt,
    FaStar,
    FaTimes,
    FaChevronDown,
    FaKey,
    FaEnvelopeOpenText,
    FaTrashAlt
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../../../assets/images/MainStage222Logo.png';
import getMediaUrl from '../../../utils/mediaUrl';

// CandidateHeader.jsx
// Professional header component for candidate pages
// RESPONSIVE: Mobile-friendly navigation, responsive dropdown positioning

const CandidateHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(3); // TODO: Replace with real data
    const profileRef = useRef(null);

    // Remove all mock user data. Use only the real user from context.
    // If user is not available, show generic fallback.
    const currentUser = user;

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const handleProfileAction = (action) => {
        setIsProfileOpen(false);
        switch (action) {
            case 'home':
                navigate('/candidate/dashboard');
                break;
            case 'applications':
                navigate('/candidate/applications');
                break;
            case 'bookmarks':
                navigate('/candidate/bookmarks');
                break;
            case 'resume':
                navigate('/candidate/resume');
                break;
            case 'preferences':
                navigate('/candidate/preferences');
                break;
            case 'safety':
                navigate('/candidate/safety-tips');
                break;
            case 'help':
                navigate('/candidate/help');
                break;
            case 'account':
                navigate('/candidate/account');
                break;
            case 'edit-profile':
                navigate('/candidate/edit-profile');
                break;
            default:
                break;
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Responsive sizing */}
                    <Link to="/candidate/dashboard" className="flex items-center">
                        <img
                            src={logo}
                            alt="Stage222 Logo"
                            className="h-8 sm:h-10 w-auto"
                            draggable="false"
                        />
                    </Link>

                    {/* Navigation Links - Hidden on mobile, responsive spacing */}
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <Link
                            to="/candidate/dashboard"
                            className="text-gray-700 hover:text-[#00A55F] font-medium transition-colors text-sm lg:text-base"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/candidate/internships"
                            className="text-gray-700 hover:text-[#00A55F] font-medium transition-colors text-sm lg:text-base"
                        >
                            Internships
                        </Link>
                        <Link
                            to="/jobs"
                            className="text-gray-700 hover:text-[#00A55F] font-medium transition-colors text-sm lg:text-base"
                        >
                            Jobs
                        </Link>
                    </nav>

                    {/* Right Section - Responsive spacing and touch targets */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Messages Icon - Touch-friendly on mobile */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-2 sm:p-2.5 text-gray-600 hover:text-[#00A55F] hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => navigate('/candidate/messages')}
                        >
                            <FaEnvelope className="h-5 w-5" />
                            {unreadMessages > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                    {unreadMessages > 9 ? '9+' : unreadMessages}
                                </span>
                            )}
                        </motion.button>

                        {/* Profile Dropdown - Responsive positioning */}
                        <div className="relative" ref={profileRef}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 p-2 sm:p-2.5 text-gray-700 hover:text-[#00A55F] hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                {/* Profile Picture - Show actual image or fallback */}
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm relative">
                                    {currentUser?.profile_picture ? (
                                        <img
                                            src={getMediaUrl(currentUser.profile_picture)}
                                            alt={`${currentUser?.first_name || 'User'} profile`}
                                            className="w-full h-full object-cover"
                                            onLoad={() => {
                                                console.log('Profile picture loaded successfully:', currentUser.profile_picture);
                                            }}
                                            onError={(e) => {
                                                console.log('Profile picture failed to load:', {
                                                    originalPath: currentUser.profile_picture,
                                                    constructedUrl: getMediaUrl(currentUser.profile_picture),
                                                    error: e
                                                });
                                                // Hide the image and show fallback
                                                e.target.style.display = 'none';
                                                const fallback = e.target.parentElement.querySelector('.profile-fallback');
                                                if (fallback) fallback.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full bg-gradient-to-br from-[#00A55F] to-[#008c4f] flex items-center justify-center profile-fallback ${currentUser?.profile_picture ? 'hidden' : 'flex'}`}>
                                        <FaUser className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <span className="hidden sm:block text-sm font-medium">
                                    {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() : 'Candidate'}
                                </span>
                                <FaChevronDown className={`h-3 w-3 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </motion.button>

                            {/* Profile Dropdown Modal - Responsive positioning and sizing */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                                    >
                                        {/* Profile Header - Responsive padding */}
                                        <div className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] p-4 sm:p-6 text-white">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {/* Profile Picture in Dropdown */}
                                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-sm relative">
                                                        {currentUser?.profile_picture ? (
                                                            <img
                                                                src={getMediaUrl(currentUser.profile_picture)}
                                                                alt={`${currentUser?.first_name || 'User'} profile`}
                                                                className="w-full h-full object-cover"
                                                                onLoad={() => {
                                                                    console.log('Dropdown profile picture loaded successfully:', currentUser.profile_picture);
                                                                }}
                                                                onError={(e) => {
                                                                    console.log('Dropdown profile picture failed to load:', {
                                                                        originalPath: currentUser.profile_picture,
                                                                        constructedUrl: getMediaUrl(currentUser.profile_picture),
                                                                        error: e
                                                                    });
                                                                    // Hide the image and show fallback
                                                                    e.target.style.display = 'none';
                                                                    const fallback = e.target.parentElement.querySelector('.dropdown-profile-fallback');
                                                                    if (fallback) fallback.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className={`w-full h-full bg-white/20 flex items-center justify-center dropdown-profile-fallback ${currentUser?.profile_picture ? 'hidden' : 'flex'}`}>
                                                            <FaUser className="h-6 w-6" />
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-semibold text-lg truncate">
                                                            {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() : 'Candidate'}
                                                        </h3>
                                                        <p className="text-white/80 text-sm truncate">{currentUser?.email || ''}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                                                >
                                                    <FaTimes className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Navigation Menu - Responsive touch targets */}
                                        <div className="p-2 sm:p-4 space-y-1">
                                            {/* Primary Actions */}
                                            <button
                                                onClick={() => handleProfileAction('home')}
                                                className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <FaHome className="h-5 w-5 text-[#00A55F] flex-shrink-0" />
                                                <span className="font-medium">Home</span>
                                            </button>

                                            <button
                                                onClick={() => handleProfileAction('applications')}
                                                className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <FaFileAlt className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                                <span className="font-medium">My Applications</span>
                                            </button>

                                            <button
                                                onClick={() => handleProfileAction('bookmarks')}
                                                className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <FaBookmark className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                                                <span className="font-medium">My Bookmarks</span>
                                            </button>

                                            <button
                                                onClick={() => handleProfileAction('resume')}
                                                className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <FaEdit className="h-5 w-5 text-purple-600 flex-shrink-0" />
                                                <span className="font-medium">Edit Resume</span>
                                            </button>

                                            <button
                                                onClick={() => handleProfileAction('edit-profile')}
                                                className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <FaUserCog className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                <span className="font-medium">Edit Profile</span>
                                            </button>

                                            <button
                                                onClick={() => handleProfileAction('preferences')}
                                                className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <FaCog className="h-5 w-5 text-gray-600 flex-shrink-0" />
                                                <span className="font-medium">Edit Preferences</span>
                                            </button>

                                            {/* Divider */}
                                            <div className="border-t border-gray-200 my-2"></div>

                                            {/* Account Management */}
                                            <button
                                                onClick={() => { setIsProfileOpen(false); navigate('/candidate/change-password'); }}
                                                className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                type="button"
                                            >
                                                <FaKey className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                                                <span className="font-medium">Change Password</span>
                                            </button>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FaSignOutAlt className="h-5 w-5 flex-shrink-0" />
                                                <span className="font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default CandidateHeader; 