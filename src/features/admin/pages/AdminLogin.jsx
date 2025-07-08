import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../context/AdminAuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCrown } from 'react-icons/fa';

const AdminLogin = () => {
    const { login } = useAdminAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const admin = await login({ email, password });
            if (admin && admin.role === 'admin') {
                toast.success(t('admin.login.welcomeAdmin'));
                navigate('/admin/dashboard');
            } else {
                setError(t('admin.login.notAuthorized'));
                toast.error(t('admin.login.notAdminAccount'));
            }
        } catch (err) {
            setError(t('admin.login.invalidCredentials'));
            toast.error(t('admin.login.loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#d1fae5] relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00A55F] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#008c4f] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-[#00d4aa] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-4 sm:p-8 w-full max-w-md mx-4 border border-white/20"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-center mb-8"
                >
                    {/* Stage222 Logo */}
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="relative">
                            <img
                                src="/src/assets/images/MainStage222Logo.png"
                                alt="Stage222"
                                className="w-24 h-16 sm:w-32 sm:h-20 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="w-24 h-16 sm:w-32 sm:h-20 bg-gradient-to-br from-[#00A55F] to-[#008c4f] rounded-2xl flex items-center justify-center shadow-lg hidden">
                                <FaCrown className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                            </div>
                        </div>
                    </div>


                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#00A55F] to-[#008c4f] bg-clip-text text-transparent mb-2">
                        {t('admin.login.welcomeBack')}
                    </h1>
                    <p className="text-gray-600 text-xs sm:text-sm">
                        {t('admin.login.accessDashboard')}
                    </p>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                >
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FaEnvelope className="h-4 w-4 text-[#00A55F]" />
                            {t('admin.login.emailAddress')}
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('admin.login.enterAdminEmail')}
                                required
                                autoFocus
                            />
                            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FaLock className="h-4 w-4 text-[#00A55F]" />
                            {t('admin.login.password')}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 pl-12 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('admin.login.enterPassword')}
                                required
                            />
                            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00A55F] transition-colors"
                            >
                                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white rounded-xl font-semibold hover:from-[#008c4f] hover:to-[#007a45] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>{t('admin.login.authenticating')}</span>
                            </div>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <FaShieldAlt className="h-4 w-4" />
                                {t('admin.login.accessAdminPanel')}
                            </span>
                        )}
                    </motion.button>
                </motion.form>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-8 text-center"
                >
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <FaShieldAlt className="h-3 w-3" />
                        <span>{t('admin.login.secureAdminAccess')}</span>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{t('admin.login.stage222Platform')}</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default AdminLogin; 