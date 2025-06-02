import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import PageWrapper from '@/components/layout/PageWrapper';

const RecruiterSignup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
    });
    const [errors, setErrors] = useState({});
    const [recaptchaToken, setRecaptchaToken] = useState(null);

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

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
        if (errors.recaptcha) {
            setErrors(prev => ({
                ...prev,
                recaptcha: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.mobileNumber) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^\+?[0-9]{10,15}$/.test(formData.mobileNumber.replace(/\s+/g, ''))) {
            newErrors.mobileNumber = 'Please enter a valid mobile number';
        }

        if (!recaptchaToken) {
            newErrors.recaptcha = 'Please complete the reCAPTCHA';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form Data:', formData);
            console.log('reCAPTCHA Token:', recaptchaToken);
        }
    };

    return (
        <PageWrapper className="min-h-screen bg-gray-50">
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
                                Hire Interns & Freshers faster
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Join Stage222 to connect with talented Mauritanian students and fresh graduates.
                                Post internships and jobs, manage applications, and build your employer brand.
                            </p>
                            <div className="hidden md:block">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center space-x-4 mb-6"
                                >
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Access to 10,000+ active students</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center space-x-4 mb-6"
                                >
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Post unlimited internships and jobs</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center space-x-4"
                                >
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Advanced application management</p>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right Column - Registration Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-lg p-8"
                        >
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
                                >
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Official Email Id
                                    </label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02, borderColor: "#00A55F" }}
                                        transition={{ type: "spring", stiffness: 300 }}
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
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1 text-sm text-red-500"
                                        >
                                            {errors.email}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <motion.input
                                        whileFocus={{ scale: 1.02, borderColor: "#00A55F" }}
                                        transition={{ type: "spring", stiffness: 300 }}
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
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1 text-sm text-red-500"
                                        >
                                            {errors.password}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <motion.input
                                            whileFocus={{ scale: 1.02, borderColor: "#00A55F" }}
                                            transition={{ type: "spring", stiffness: 300 }}
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
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-1 text-sm text-red-500"
                                            >
                                                {errors.firstName}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <motion.input
                                            whileFocus={{ scale: 1.02, borderColor: "#00A55F" }}
                                            transition={{ type: "spring", stiffness: 300 }}
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
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-1 text-sm text-red-500"
                                            >
                                                {errors.lastName}
                                            </motion.p>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">+222</span>
                                        </div>
                                        <motion.input
                                            whileFocus={{ scale: 1.02, borderColor: "#00A55F" }}
                                            transition={{ type: "spring", stiffness: 300 }}
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
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1 text-sm text-red-500"
                                        >
                                            {errors.mobileNumber}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="flex justify-center"
                                >
                                    <ReCAPTCHA
                                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                        onChange={handleRecaptchaChange}
                                    />
                                </motion.div>
                                {errors.recaptcha && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-red-500 text-center"
                                    >
                                        {errors.recaptcha}
                                    </motion.p>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ duration: 0.2 }}
                                    type="submit"
                                    className="w-full bg-[#00A55F] text-white px-6 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium text-lg"
                                >
                                    Post for Free
                                </motion.button>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-center"
                                >
                                    <p className="text-gray-600">
                                        Already registered?{' '}
                                        <Link to="/login" className="text-[#00A55F] hover:text-[#008c4f] font-medium transition-colors">
                                            Login
                                        </Link>
                                    </p>
                                </motion.div>
                            </motion.form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default RecruiterSignup; 