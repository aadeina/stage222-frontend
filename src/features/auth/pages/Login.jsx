import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('student');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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



    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = t('validation.required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('validation.email');
        }

        if (!formData.password) {
            newErrors.password = t('validation.required');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const payload = {
                email: formData.email,
                password: formData.password,
                role: activeTab === 'student' ? 'candidate' : 'recruiter'
            };
            const response = await api.post('/auth/login/', payload);

            const { access, refresh, user } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('user', JSON.stringify(user));
            updateUser(user);
            toast.success(t('auth.loginSuccess') || 'Login successful!');

            // Redirect based on role and onboarding
            if (user.role === 'recruiter') {
                if (user.is_onboarding) {
                    navigate('/recruiter/dashboard');
                } else {
                    navigate('/recruiter/dashboard');
                }
            } else if (user.role === 'candidate') {
                if (user.is_onboarding) {
                    navigate('/candidate/onboarding');
                } else {
                    navigate('/candidate/dashboard');
                }
            } else {
                toast.error('Invalid user role');
            }

        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || t('auth.loginFailed') || 'Login failed. Please try again.';
            toast.error(errorMessage);

            // Set form errors if available
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('auth.loginToStage222') || 'Login to Stage222'}
                    </h1>
                    <p className="text-gray-600">
                        {t('auth.accessAccount') || 'Access your account'}
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 px-4 py-2 font-medium text-sm ${activeTab === 'student'
                            ? 'text-[#00A55F] border-b-2 border-[#00A55F]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('student')}
                    >
                        {t('auth.student')}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 px-4 py-2 font-medium text-sm ${activeTab === 'employer'
                            ? 'text-[#00A55F] border-b-2 border-[#00A55F]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('employer')}
                    >
                        {t('auth.employer')}
                    </motion.button>
                </div>

                {/* Login Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('forms.email')}
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.02, borderColor: "#00A55F" }}
                            transition={{ type: "spring", stiffness: 300 }}
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder={t('auth.enterEmail')}
                        />
                        {errors.email && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-1 text-sm text-red-500"
                            >
                                {errors.email}
                            </motion.p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('forms.password')}
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.02, borderColor: "#00A55F" }}
                            transition={{ type: "spring", stiffness: 300 }}
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder={t('auth.enterPassword')}
                        />
                        {errors.password && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-1 text-sm text-red-500"
                            >
                                {errors.password}
                            </motion.p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Link to="/reset-password" className="text-sm text-[#00A55F] hover:text-[#008c4f] transition-colors">
                            {t('auth.forgotPassword')}
                        </Link>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('auth.loggingIn') || 'Logging in...'}
                            </div>
                        ) : (
                            t('auth.login')
                        )}
                    </motion.button>
                </motion.form>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-gray-600">
                        {t('auth.newToStage222')}{' '}
                        <Link
                            to={activeTab === 'student' ? '/register/student' : '/register/employer'}
                            className="text-[#00A55F] hover:text-[#008c4f] font-medium transition-colors"
                        >
                            {t('auth.registerAs')} {activeTab === 'student' ? t('auth.student') : t('auth.employer')}
                        </Link>
                    </p>
                </motion.div>
            </motion.div >
        </div >
    );
};

export default Login;
