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
        { number: 1, title: 'Personal Details' },
        { number: 2, title: 'Organization Details' },
        { number: 3, title: 'Final Step' }
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step) => (
                            <div key={step.number} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= step.number
                                        ? 'bg-[#00A55F] text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {step.number}
                                </div>
                                <div className="ml-2 text-sm font-medium text-gray-900">
                                    {step.title}
                                </div>
                                {step.number < steps.length && (
                                    <div
                                        className={`w-24 h-1 mx-4 ${currentStep > step.number
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
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
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
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
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
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.designation ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.designation && (
                                        <p className="mt-1 text-sm text-red-500">{errors.designation}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value="+222"
                                            disabled
                                            className="w-20 px-4 py-2 border border-gray-300 bg-gray-50 text-gray-500 rounded-lg"
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                            className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={isSendingOtp || !formData.phone || !/^\d{8}$/.test(formData.phone)}
                                            className="px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSendingOtp ? (
                                                <div className="flex items-center">
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
                                    <div className="mt-4 space-y-3">
                                        <p className="text-sm text-gray-600">
                                            OTP sent to your mobile. Valid for 10 minutes.
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={handleOtpChange}
                                                placeholder="Enter 6-digit OTP"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={isVerifyingOtp || !otp || otp.length !== 6}
                                                className="px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isVerifyingOtp ? (
                                                    <div className="flex items-center">
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
                                    </div>
                                )}

                                {phoneVerified && (
                                    <div className="flex items-center text-sm text-[#00A55F]">
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Phone number verified
                                    </div>
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
                    <div className="mt-8 flex justify-between">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F]"
                            >
                                Back
                            </button>
                        )}
                        <div className="flex-1" />
                        {currentStep < steps.length ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F]"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </div>
                                ) : (
                                    'Complete Onboarding'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterOnboarding; 