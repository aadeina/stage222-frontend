import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { registerUser } from '@/services/authApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

/**
 * RegisterForm Component
 * A reusable registration form that automatically assigns user roles based on the registration page.
 * 
 * @param {Object} props
 * @param {string} props.role - The user role ('candidate' or 'recruiter')
 * @param {string} props.title - The form title
 * @param {string} props.description - The form description
 * @param {Array} props.features - Array of features to display
 */
const RegisterForm = ({ role, title, description, features }) => {
    const navigate = useNavigate();
    const { storeSignupData } = useAuth();
    const { t } = useTranslation();
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        mobileNumber: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = t('validation.required');
        if (!formData.password) newErrors.password = t('validation.required');
        if (formData.password && formData.password.length < 6) {
            newErrors.password = t('validation.passwordMinLength');
        }
        if (!formData.firstName) newErrors.firstName = t('validation.firstNameRequired');
        if (!formData.lastName) newErrors.lastName = t('validation.lastNameRequired');
        if (!formData.mobileNumber) newErrors.mobileNumber = t('validation.mobileNumberRequired');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Send a clean payload with only the required backend-compatible keys
            const response = await registerUser({
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone_number: formData.mobileNumber,
                role // Automatically determined by the parent component
            });

            // Store signup data for both candidates and recruiters to pre-fill their profiles
            storeSignupData({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email
            });

            toast.success(t('auth.otpSent'));
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (error) {
            toast.error(
                error.response?.data?.message || t('auth.registrationFailed')
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center md:text-left"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {title}
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            {description}
                        </p>
                        <div className="hidden md:block">
                            {Array.isArray(features) && features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex items-center space-x-4 mb-6"
                                >
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">{feature}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column - Registration Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-lg p-8"
                    >
                        {!showEmailForm ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowEmailForm(true)}
                                    className="w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg hover:bg-[#008c4f] transition-colors"
                                >
                                    {t('auth.signUpWithEmail')}
                                </button>
                                <p className="text-center text-sm text-gray-600">
                                    {t('auth.alreadyHaveAccount')}{' '}
                                    <Link to="/login" className="text-[#00A55F] hover:text-[#008c4f] font-medium">
                                        {t('auth.logIn')}
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('forms.firstName')}
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="John"
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('forms.lastName')}
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Doe"
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('forms.email')}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('forms.phone')}
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                            +222
                                        </span>
                                        <input
                                            type="tel"
                                            id="mobileNumber"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleInputChange}
                                            className={`flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="12345678"
                                        />
                                    </div>
                                    {errors.mobileNumber && (
                                        <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('forms.password')}
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="h-4 w-4 text-[#00A55F] focus:ring-[#00A55F] border-gray-300 rounded"
                                    />
                                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                        {t('auth.agreeToTerms')}{' '}
                                        <Link to="/terms" className="text-[#00A55F] hover:text-[#008c4f]">
                                            {t('auth.termsAndConditions')}
                                        </Link>
                                    </label>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg hover:bg-[#008c4f] transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
                                    </button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className="text-center"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setShowEmailForm(false)}
                                        className="text-[#00A55F] hover:text-[#008c4f] font-medium"
                                    >
                                        {t('auth.backToSignUpOptions')}
                                    </button>
                                </motion.div>
                            </motion.form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm; 