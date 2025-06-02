// File: src/features/recruiter/pages/RecruiterSignup.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';

const RecruiterSignup = () => {
    // Form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        mobileNumber: "",
    });

    // Validation state
    const [errors, setErrors] = useState({});
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    // Handle input changes
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

    // Handle reCAPTCHA change
    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
        if (errors.recaptcha) {
            setErrors(prev => ({
                ...prev,
                recaptcha: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Name validation
        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        }

        // Mobile number validation
        if (!formData.mobileNumber) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^\+?[0-9]{10,15}$/.test(formData.mobileNumber.replace(/\s+/g, ''))) {
            newErrors.mobileNumber = 'Please enter a valid mobile number';
        }

        // reCAPTCHA validation
        if (!recaptchaToken) {
            newErrors.recaptcha = 'Please complete the reCAPTCHA';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form Data:', formData);
            console.log('reCAPTCHA Token:', recaptchaToken);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Text Content */}
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Hire Interns & Freshers faster
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Join Stage222 to connect with talented Mauritanian students and fresh graduates.
                                Post internships and jobs, manage applications, and build your employer brand.
                            </p>
                            <div className="hidden md:block">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Access to 10,000+ active students</p>
                                </div>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Post unlimited internships and jobs</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Advanced application management</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Registration Form */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Official Email Id
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your official email"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your password"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter first name"
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter last name"
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">+222</span>
                                        </div>
                                        <input
                                            type="tel"
                                            id="mobileNumber"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleChange}
                                            className={`w-full pl-12 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter mobile number"
                                        />
                                    </div>
                                    {errors.mobileNumber && (
                                        <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>
                                    )}
                                </div>

                                <div className="flex justify-center">
                                    <ReCAPTCHA
                                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                        onChange={handleRecaptchaChange}
                                    />
                                </div>
                                {errors.recaptcha && (
                                    <p className="text-sm text-red-500 text-center">{errors.recaptcha}</p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-[#00A55F] text-white px-6 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium text-lg"
                                >
                                    Post for Free
                                </button>

                                <div className="text-center">
                                    <p className="text-gray-600">
                                        Already registered?{' '}
                                        <Link to="/login" className="text-[#00A55F] hover:text-[#008c4f] font-medium transition-colors">
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterSignup;
