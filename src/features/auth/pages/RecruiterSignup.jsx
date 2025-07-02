import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register } from '../api/authApi';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const RecruiterSignup = () => {
    const navigate = useNavigate();
    const { storeSignupData } = useAuth();
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
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';

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

            toast.success('OTP sent to your email!');
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');

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
                                Hire Top Talent in Mauritania
                            </h1>
                            <p className="text-gray-600 mb-8">
                                Post Internships for Free & Hire Fresh Graduates and Young Professionals
                            </p>

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
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="name@company.com"
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
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Minimum 6 characters"
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
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Your First Name"
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
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Your Last Name"
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
                                            placeholder="Enter mobile number"
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
                                        By clicking on Post for Free, you agree to our{' '}
                                        <Link to="/terms" className="text-[#00A55F] hover:text-[#008c4f]">
                                            T&C
                                        </Link>
                                    </label>
                                </div>

                                <button
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
                                            Registering...
                                        </div>
                                    ) : (
                                        'Post for Free'
                                    )}
                                </button>

                                <p className="text-center text-sm text-gray-600">
                                    Already registered?{' '}
                                    <Link to="/login" className="text-[#00A55F] hover:text-[#008c4f] font-medium">
                                        Login
                                    </Link>
                                </p>
                            </form>
                        </motion.div>

                        {/* Right Column - Statistics and Features */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-12"
                        >
                            {/* Why Hire Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Why Hire from Stage222?
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Join Mauritania's fastest-growing talent platform and build your dream team with ease.
                                </p>

                                {/* Statistics Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-3xl font-bold text-[#00A55F] mb-2">10K+</h3>
                                        <p className="text-gray-600">active students and graduates</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-3xl font-bold text-[#00A55F] mb-2">500+</h3>
                                        <p className="text-gray-600">successful placements</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-3xl font-bold text-[#00A55F] mb-2">Nouakchott</h3>
                                        <p className="text-gray-600">50+ Job Categories</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-3xl font-bold text-[#00A55F] mb-2">100+</h3>
                                        <p className="text-gray-600">Companies Hiring on Stage222</p>
                                    </div>
                                </div>
                            </div>

                            {/* Features Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Your Gateway to Mauritania's Top Talent
                                </h2>

                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Talent Matching</h3>
                                        <p className="text-gray-600">AI-powered platform to find the perfect candidates for your roles.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Communication</h3>
                                        <p className="text-gray-600">Connect instantly with candidates through our integrated messaging system.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Streamlined Hiring Process</h3>
                                        <p className="text-gray-600">Complete hiring toolkit with interview scheduling and skill assessment tools.</p>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <p className="text-gray-600 mb-4">Trusted by Leading Companies in Mauritania</p>
                                    <button className="bg-[#00A55F] text-white px-8 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium">
                                        Start hiring talent for free
                                    </button>
                                </div>
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
                            <h3 className="font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link to="/" className="hover:text-[#00A55F]">Home</Link></li>
                                <li><Link to="/hire" className="hover:text-[#00A55F]">Hire Talent</Link></li>
                                <li><Link to="/about" className="hover:text-[#00A55F]">About us</Link></li>
                                <li><Link to="/blog" className="hover:text-[#00A55F]">Blog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><Link to="/careers" className="hover:text-[#00A55F]">We're hiring</Link></li>
                                <li><Link to="/resources" className="hover:text-[#00A55F]">Employer resources</Link></li>
                                <li><Link to="/services" className="hover:text-[#00A55F]">Our services</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link to="/terms" className="hover:text-[#00A55F]">Terms & conditions</Link></li>
                                <li><Link to="/privacy" className="hover:text-[#00A55F]">Privacy</Link></li>
                                <li><Link to="/refund" className="hover:text-[#00A55F]">Refund policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2">
                                <li><Link to="/contact" className="hover:text-[#00A55F]">Contact us</Link></li>
                                <li><Link to="/sitemap" className="hover:text-[#00A55F]">Sitemap</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                        <p>© Copyright 2025 Stage222</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default RecruiterSignup; 