import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaChevronDown,
    FaShieldAlt,
    FaEnvelope,
    FaCalendarAlt,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Get admin data from localStorage
    const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
    const adminEmail = adminData.email || 'admin@stage222.com';
    const adminName = adminData.name || 'Admin User';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Clear admin data
        localStorage.removeItem('admin');
        localStorage.removeItem('admin_token');

        // Show success message
        toast.success('Logged out successfully');

        // Redirect to admin login
        navigate('/admin/login');
    };

    const handleChangePassword = () => {
        setShowChangePasswordModal(true);
        setIsOpen(false);
        // Reset form data
        setPasswordData({
            old_password: '',
            new_password: '',
            confirm_password: ''
        });
        setShowPasswords({
            old: false,
            new: false,
            confirm: false
        });
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmitPasswordChange = async () => {
        // Validation
        if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.new_password.length < 6) {
            toast.error('New password must be at least 6 characters long');
            return;
        }

        setIsChangingPassword(true);
        try {
            const adminToken = localStorage.getItem('admin_token');
            const response = await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/change-password/`,
                {
                    old_password: passwordData.old_password,
                    new_password: passwordData.new_password
                },
                {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.message) {
                toast.success(response.data.message);
                setShowChangePasswordModal(false);
                setPasswordData({
                    old_password: '',
                    new_password: '',
                    confirm_password: ''
                });
            }
        } catch (error) {
            console.error('Password change error:', error);
            if (error.response?.data?.detail) {
                toast.error(error.response.data.detail);
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to change password. Please try again.');
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleViewProfile = () => {
        setShowProfileModal(true);
        setIsOpen(false);
    };

    return (
        <>
            {/* Profile Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <FaUser className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{adminName}</p>
                        <p className="text-xs text-gray-500">{adminEmail}</p>
                    </div>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FaChevronDown className="h-3 w-3 text-gray-400" />
                    </motion.div>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                        >
                            {/* Profile Header */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                        <FaUser className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{adminName}</h3>
                                        <p className="text-sm text-gray-500">{adminEmail}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <FaShieldAlt className="h-3 w-3 text-green-500" />
                                            <span className="text-xs text-green-600 font-medium">Administrator</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                <motion.button
                                    whileHover={{ backgroundColor: '#f3f4f6' }}
                                    onClick={handleViewProfile}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FaUser className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">View Profile</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ backgroundColor: '#f3f4f6' }}
                                    onClick={handleChangePassword}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FaCog className="h-4 w-4 text-purple-500" />
                                    <span className="font-medium">Change Password</span>
                                </motion.button>

                                <div className="border-t border-gray-100 my-2"></div>

                                <motion.button
                                    whileHover={{ backgroundColor: '#fef2f2' }}
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <FaSignOutAlt className="h-4 w-4" />
                                    <span className="font-medium">Logout</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Change Password Modal */}
            <AnimatePresence>
                {showChangePasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-xl shadow-xl max-w-md w-full"
                        >
                            <div className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white p-6 rounded-t-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                            <FaCog className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Change Password</h2>
                                            <p className="text-green-100">Enter your current password and choose a new secure password</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowChangePasswordModal(false)}
                                        className="text-white hover:text-green-100 transition-colors"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmitPasswordChange(); }}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.old ? "text" : "password"}
                                                value={passwordData.old_password}
                                                onChange={(e) => handlePasswordChange('old_password', e.target.value)}
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-colors"
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('old')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00A55F] transition-colors"
                                            >
                                                {showPasswords.old ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.new ? "text" : "password"}
                                                value={passwordData.new_password}
                                                onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-colors"
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('new')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00A55F] transition-colors"
                                            >
                                                {showPasswords.new ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                value={passwordData.confirm_password}
                                                onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-colors"
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('confirm')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00A55F] transition-colors"
                                            >
                                                {showPasswords.confirm ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isChangingPassword}
                                            className="flex-1 px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isChangingPassword ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Updating...
                                                </div>
                                            ) : (
                                                'Update Password'
                                            )}
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowChangePasswordModal(false)}
                                            disabled={isChangingPassword}
                                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Profile Modal */}
            <AnimatePresence>
                {showProfileModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-xl shadow-xl max-w-md w-full"
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                            <FaUser className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Admin Profile</h2>
                                            <p className="text-blue-100">Your account information</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowProfileModal(false)}
                                        className="text-white hover:text-blue-100 transition-colors"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FaUser className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Name</p>
                                        <p className="text-sm text-gray-600">{adminName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FaEnvelope className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Email</p>
                                        <p className="text-sm text-gray-600">{adminEmail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FaShieldAlt className="h-5 w-5 text-purple-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Role</p>
                                        <p className="text-sm text-gray-600">Administrator</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FaCalendarAlt className="h-5 w-5 text-orange-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Member Since</p>
                                        <p className="text-sm text-gray-600">January 2024</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 pt-0">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowProfileModal(false)}
                                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminProfileDropdown;
