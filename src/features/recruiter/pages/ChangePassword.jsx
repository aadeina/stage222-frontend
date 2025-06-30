import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '@/services/api';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Current password validation
        if (!formData.oldPassword.trim()) {
            newErrors.oldPassword = 'Current password is required';
        }

        // New password validation
        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters long';
        } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain at least one number';
        } else if (!/(?=.*[@$!%*?&])/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain at least one special character (@$!%*?&)';
        }

        // Confirm password validation
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Check if new password is same as current
        if (formData.oldPassword && formData.newPassword &&
            formData.oldPassword === formData.newPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await api.put('/auth/change-password/', {
                old_password: formData.oldPassword,
                new_password: formData.newPassword
            });

            toast.success('Password changed successfully!');

            // Clear form
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswords({
                current: false,
                new: false,
                confirm: false
            });
            setErrors({});

            // Navigate back after a short delay
            setTimeout(() => {
                navigate(-1);
            }, 1500);

        } catch (error) {
            console.error('Password change error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to change password. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: 'gray' };

        let score = 0;
        if (password.length >= 8) score++;
        if (/(?=.*[a-z])/.test(password)) score++;
        if (/(?=.*[A-Z])/.test(password)) score++;
        if (/(?=.*\d)/.test(password)) score++;
        if (/(?=.*[@$!%*?&])/.test(password)) score++;

        const strengthMap = {
            0: { label: 'Very Weak', color: 'red' },
            1: { label: 'Weak', color: 'orange' },
            2: { label: 'Fair', color: 'yellow' },
            3: { label: 'Good', color: 'blue' },
            4: { label: 'Strong', color: 'green' },
            5: { label: 'Very Strong', color: 'emerald' }
        };

        return { score, ...strengthMap[score] };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="h-5 w-5" />
                        </motion.button>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
                            <p className="text-gray-600">Update your account password to keep it secure</p>
                        </div>

                        <div className="flex items-center gap-3 bg-[#00A55F]/10 px-4 py-2 rounded-lg">
                            <MdSecurity className="text-[#00A55F] text-xl" />
                            <div>
                                <p className="text-sm font-medium text-[#00A55F]">Security</p>
                                <p className="text-xs text-[#00A55F]/70">Account Protection</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
                        >
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Password</h2>
                                <p className="text-gray-600">Enter your current password and choose a new secure password</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            id="oldPassword"
                                            name="oldPassword"
                                            value={formData.oldPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-colors ${errors.oldPassword ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('current')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPasswords.current ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.oldPassword && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                            <FaExclamationTriangle className="h-4 w-4" />
                                            {errors.oldPassword}
                                        </p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-colors ${errors.newPassword ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPasswords.new ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                            <FaExclamationTriangle className="h-4 w-4" />
                                            {errors.newPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-colors ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Confirm your new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPasswords.confirm ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                            <FaExclamationTriangle className="h-4 w-4" />
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#00A55F] hover:bg-[#008c4f] shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Updating Password...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <FaLock className="h-5 w-5" />
                                            <span>Update Password</span>
                                        </div>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Security Tips Section */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Password Strength Indicator */}
                            {formData.newPassword && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MdSecurity className="text-[#00A55F]" />
                                        Password Strength
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Strength:</span>
                                            <span className={`text-sm font-medium text-${passwordStrength.color}-600`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color === 'red' ? 'bg-red-500' :
                                                    passwordStrength.color === 'orange' ? 'bg-orange-500' :
                                                        passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                                            passwordStrength.color === 'blue' ? 'bg-blue-500' :
                                                                passwordStrength.color === 'green' ? 'bg-green-500' :
                                                                    'bg-emerald-500'
                                                    }`}
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {passwordStrength.score}/5 criteria met
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Tips */}
                            <div className="bg-gradient-to-br from-[#00A55F]/5 via-emerald-50 to-green-50 rounded-2xl border border-[#00A55F]/20 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaLock className="text-[#00A55F]" />
                                    Security Tips
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <FaCheckCircle className="text-[#00A55F] mt-1 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">Use at least 8 characters</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaCheckCircle className="text-[#00A55F] mt-1 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">Include uppercase and lowercase letters</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaCheckCircle className="text-[#00A55F] mt-1 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">Add numbers and special characters</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaCheckCircle className="text-[#00A55F] mt-1 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">Avoid common words and patterns</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaCheckCircle className="text-[#00A55F] mt-1 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">Don't reuse passwords from other accounts</p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Security */}
                            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MdSecurity className="text-blue-600" />
                                    Account Security
                                </h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Keep your account secure by regularly updating your password and enabling two-factor authentication.
                                </p>
                                <button
                                    onClick={() => navigate('/recruiter/security-settings')}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    Security Settings →
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword; 