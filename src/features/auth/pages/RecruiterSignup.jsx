import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { register } from '../api/authApi';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const RecruiterSignup = () => {
    const navigate = useNavigate();
    const { storeSignupData } = useAuth();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        mobileNumber: ''
    });
    const [errors, setErrors] = useState({});

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
        if (!formData.email) newErrors.email = t('auth.enterValidEmail');
        if (!formData.password) newErrors.password = t('auth.passwordRequired');
        if (formData.password && formData.password.length < 6) {
            newErrors.password = t('auth.passwordMinLength');
        }
        if (!formData.firstName) newErrors.firstName = t('auth.firstNameRequired');
        if (!formData.lastName) newErrors.lastName = t('auth.lastNameRequired');
        if (!formData.mobileNumber) newErrors.mobileNumber = t('validation.mobileNumberRequired');

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
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone_number: formData.mobileNumber,
                role: 'recruiter'
            };

            await register(payload);

            // Store signup data for onboarding pre-fill
            storeSignupData({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email
            });

            toast.success(t('auth.otpSent'));
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || t('auth.registrationFailed'));

            // Set form errors if available
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Left Column - Registration Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-lg p-8"
                        >
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {t('auth.hireTopTalent')}
                            </h1>
                            <p className="text-gray-600 mb-8">
                                {t('auth.postInternshipsFree')}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('auth.officialEmailId')}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder={t('auth.nameAtCompany')}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div>
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
                                        placeholder={t('auth.minimum6Characters')}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
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
                                            placeholder={t('auth.yourFirstName')}
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
                                            placeholder={t('auth.yourLastName')}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('auth.mobileNumber')}
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
                                            placeholder={t('auth.enterMobileNumber')}
                                        />
                                    </div>
                                    {errors.mobileNumber && (
                                        <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="h-4 w-4 text-[#00A55F] focus:ring-[#00A55F] border-gray-300 rounded"
                                    />
                                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                        {t('auth.byClickingPost')}
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg hover:bg-[#008c4f] transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? t('auth.creatingAccount') : t('auth.postForFree')}
                                </button>

                                <p className="text-center text-sm text-gray-600">
                                    {t('auth.alreadyRegistered')}{' '}
                                    <Link to="/login" className="text-[#00A55F] hover:text-[#008c4f] font-medium">
                                        {t('auth.login')}
                                    </Link>
                                </p>
                            </form>
                        </motion.div>

                        {/* Right Column - Features */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center md:text-left"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {t('auth.whyHireFromStage222')}
                            </h2>
                            <p className="text-gray-600 mb-8">
                                {t('auth.joinMauritaniaFastest')}
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#00A55F] mb-2">10K+</div>
                                    <div className="text-sm text-gray-600">{t('auth.activeStudents')}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#00A55F] mb-2">500+</div>
                                    <div className="text-sm text-gray-600">{t('auth.successfulPlacements')}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#00A55F] mb-2">Nouakchott</div>
                                    <div className="text-sm text-gray-600">50+ {t('auth.jobCategories')}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#00A55F] mb-2">100+</div>
                                    <div className="text-sm text-gray-600">{t('auth.companiesHiring')}</div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                {t('auth.gatewayToMauritania')}
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">{t('auth.smartTalentMatching')}</h4>
                                        <p className="text-sm text-gray-600">{t('auth.aiPoweredPlatform')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">{t('auth.directCommunication')}</h4>
                                        <p className="text-sm text-gray-600">{t('auth.connectInstantly')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">{t('auth.streamlinedHiring')}</h4>
                                        <p className="text-sm text-gray-600">{t('auth.completeHiringToolkit')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('auth.trustedByLeading')}</h4>
                                <button className="w-full bg-[#00A55F] text-white px-6 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium">
                                    {t('auth.startHiringTalent')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-12">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">{t('auth.quickLinks')}</h3>
                            <ul className="space-y-2">
                                <li><Link to="/" className="hover:text-[#00A55F]">{t('auth.home')}</Link></li>
                                <li><Link to="/hire" className="hover:text-[#00A55F]">{t('auth.hireTalent')}</Link></li>
                                <li><Link to="/about" className="hover:text-[#00A55F]">{t('auth.aboutUs')}</Link></li>
                                <li><Link to="/blog" className="hover:text-[#00A55F]">{t('auth.blog')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">{t('auth.resources')}</h3>
                            <ul className="space-y-2">
                                <li><Link to="/careers" className="hover:text-[#00A55F]">{t('auth.wereHiring')}</Link></li>
                                <li><Link to="/resources" className="hover:text-[#00A55F]">{t('auth.employerResources')}</Link></li>
                                <li><Link to="/services" className="hover:text-[#00A55F]">{t('auth.ourServices')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">{t('auth.legal')}</h3>
                            <ul className="space-y-2">
                                <li><Link to="/terms" className="hover:text-[#00A55F]">{t('auth.termsConditions')}</Link></li>
                                <li><Link to="/contact" className="hover:text-[#00A55F]">{t('auth.privacy')}</Link></li>
                                <li><Link to="/refund" className="hover:text-[#00A55F]">{t('auth.refundPolicy')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">{t('auth.contact')}</h3>
                            <ul className="space-y-2">
                                <li><Link to="/contact" className="hover:text-[#00A55F]">{t('auth.contactUs')}</Link></li>
                                <li><Link to="/sitemap" className="hover:text-[#00A55F]">{t('auth.sitemap')}</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                        <p>{t('auth.copyright')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default RecruiterSignup; 