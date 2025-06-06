import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { submitRecruiterOnboarding } from '../api/onboardingApi';
import { sendOtp, verifyRecruiterOtp } from '../../../services/authApi';
import toast from 'react-hot-toast';

const RecruiterOnboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Personal Details
        firstName: '',
        lastName: '',
        email: '',
        designation: '',
        phone: '',
        // Step 2: Organization Details
        orgName: '',
        industry: '',
        website: '',
        address: '',
        // Step 3: Logo
        logo: null
    });
    const [errors, setErrors] = useState({});

    const steps = [
        {
            number: 1,
            title: 'Personal Details',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            description: 'Tell us about yourself'
        },
        {
            number: 2,
            title: 'Organization Details',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            description: 'Company information'
        },
        {
            number: 3,
            title: 'Post Internship/Job',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            description: 'Final setup'
        }
    ];

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.firstName) newErrors.firstName = 'First name is required';
                if (!formData.lastName) newErrors.lastName = 'Last name is required';
                if (!formData.email) newErrors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
                if (!formData.designation) newErrors.designation = 'Designation is required';
                if (!formData.phone) newErrors.phone = 'Phone number is required';
                else if (!/^\d{8}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 8 digits';
                if (!phoneVerified) newErrors.phone = 'Please verify your phone number first';
                break;
            case 2:
                if (!formData.orgName) newErrors.orgName = 'Organization name is required';
                if (!formData.industry) newErrors.industry = 'Industry is required';
                if (!formData.website) newErrors.website = 'Website is required';
                if (!formData.address) newErrors.address = 'Address is required';
                break;
            case 3:
                if (!formData.logo) newErrors.logo = 'Company logo is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
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

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                logo: file
            }));
            if (errors.logo) {
                setErrors(prev => ({
                    ...prev,
                    logo: ''
                }));
            }
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            await submitRecruiterOnboarding(formDataToSend);
            toast.success('Onboarding completed successfully!');
            navigate('/dashboard/employer');
        } catch (error) {
            console.error('Onboarding error:', error);
            toast.error(error.response?.data?.message || 'Failed to complete onboarding');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!formData.phone || !/^\d{8}$/.test(formData.phone)) {
            setErrors(prev => ({ ...prev, phone: 'Please enter a valid 8-digit phone number' }));
            return;
        }

        setIsSendingOtp(true);
        try {
            await sendOtp(formData.phone);
            setShowOtpField(true);
            toast.success('OTP sent successfully!');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setIsVerifyingOtp(true);
        try {
            await verifyRecruiterOtp(formData.phone, otp);
            setPhoneVerified(true);
            toast.success('Phone number verified successfully!');
            // Automatically proceed to next step after successful verification
            setCurrentStep(2);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Invalid OTP');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setOtp(value);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        {steps.map((step) => (
                            <div key={step.number} className="flex items-center w-full sm:w-auto">
                                <motion.div
                                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${currentStep >= step.number
                                        ? 'bg-[#00A55F] text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                    animate={{
                                        scale: currentStep === step.number ? [1, 1.1, 1] : 1,
                                        transition: { duration: 0.5 }
                                    }}
                                >
                                    {step.icon}
                                </motion.div>
                                <div className="ml-3 flex-1 sm:flex-none">
                                    <div className="text-sm font-medium text-gray-900">
                                        {step.title}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {step.description}
                                    </div>
                                </div>
                                {step.number < steps.length && (
                                    <div
                                        className={`hidden sm:block w-12 md:w-24 h-1 mx-2 md:mx-4 ${currentStep > step.number
                                            ? 'bg-[#00A55F]'
                                            : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
                >
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4 sm:space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Designation
                                    </label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.designation ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.designation && (
                                        <p className="mt-1 text-sm text-red-500">{errors.designation}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value="+222"
                                                disabled
                                                className="w-16 sm:w-20 px-3 sm:px-4 py-2 border border-gray-300 bg-gray-50 text-gray-500 rounded-lg"
                                            />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Enter your phone number"
                                                className={`flex-1 px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={isSendingOtp || !formData.phone || !/^\d{8}$/.test(formData.phone)}
                                            className="w-full sm:w-auto px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSendingOtp ? (
                                                <div className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </div>
                                            ) : (
                                                'Verify'
                                            )}
                                        </button>
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                    )}
                                </div>

                                {showOtpField && !phoneVerified && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 space-y-3"
                                    >
                                        <p className="text-sm text-gray-600">
                                            OTP sent to your mobile. Valid for 10 minutes.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={handleOtpChange}
                                                placeholder="Enter 6-digit OTP"
                                                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={isVerifyingOtp || !otp || otp.length !== 6}
                                                className="w-full sm:w-auto px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isVerifyingOtp ? (
                                                    <div className="flex items-center justify-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Verifying...
                                                    </div>
                                                ) : (
                                                    'Submit OTP'
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {phoneVerified && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center text-sm text-[#00A55F]"
                                    >
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Phone number verified
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Organization Name
                                    </label>
                                    <input
                                        type="text"
                                        name="orgName"
                                        value={formData.orgName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.orgName ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.orgName && (
                                        <p className="mt-1 text-sm text-red-500">{errors.orgName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Industry
                                    </label>
                                    <input
                                        type="text"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.industry && (
                                        <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.website ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.website && (
                                        <p className="mt-1 text-sm text-red-500">{errors.website}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Logo
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                        <div className="space-y-1 text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="logo-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#00A55F] hover:text-[#008c4f] focus-within:outline-none"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="logo-upload"
                                                        name="logo"
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={handleLogoChange}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                    </div>
                                    {formData.logo && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Selected file: {formData.logo.name}
                                        </p>
                                    )}
                                    {errors.logo && (
                                        <p className="mt-1 text-sm text-red-500">{errors.logo}</p>
                                    )}
                                </div>

                                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Information</h3>
                                    <dl className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                                            <dd className="text-sm text-gray-900">{formData.firstName} {formData.lastName}</dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="text-sm text-gray-900">{formData.email}</dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Designation</dt>
                                            <dd className="text-sm text-gray-900">{formData.designation}</dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Organization</dt>
                                            <dd className="text-sm text-gray-900">{formData.orgName}</dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Industry</dt>
                                            <dd className="text-sm text-gray-900">{formData.industry}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between gap-4 sm:gap-0">
                        {currentStep > 1 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleBack}
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors"
                            >
                                Back
                            </motion.button>
                        )}
                        <div className="flex-1" />
                        {currentStep < steps.length ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleNext}
                                className="w-full sm:w-auto px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors"
                            >
                                Next
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full sm:w-auto px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </div>
                                ) : (
                                    'Complete Onboarding'
                                )}
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RecruiterOnboarding; 