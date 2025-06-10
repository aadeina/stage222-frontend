import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import AfterImg from '../assets/images/after_image.webp';
import BeforImg from '../assets/images/before_image.webp';

const Home = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('student');

    // Placeholder data for internships
    const internships = [
        {
            id: 1,
            title: "Software Development Intern",
            company: "Tech Solutions MR",
            location: "Nouakchott",
            duration: "3 months",
            stipend: "50,000 MRU/month"
        },
        {
            id: 2,
            title: "Marketing Intern",
            company: "Digital Marketing Agency",
            location: "Nouakchott",
            duration: "2 months",
            stipend: "40,000 MRU/month"
        },
        {
            id: 3,
            title: "Business Development Intern",
            company: "Growth Partners",
            location: "Nouadhibou",
            duration: "4 months",
            stipend: "45,000 MRU/month"
        }
    ];

    // Placeholder data for jobs
    const jobs = [
        {
            id: 1,
            title: "Junior Software Engineer",
            company: "Tech Innovations MR",
            location: "Nouakchott",
            salary: "150,000 MRU/month"
        },
        {
            id: 2,
            title: "Digital Marketing Specialist",
            company: "Creative Solutions",
            location: "Nouakchott",
            salary: "120,000 MRU/month"
        }
    ];

    // Placeholder data for testimonials
    const testimonials = [
        {
            id: 1,
            name: "Ahmed Mohamed",
            role: "Computer Science Student",
            text: "Stage222 helped me land my dream internship at a leading tech company. The platform is incredibly user-friendly and the opportunities are amazing!"
        },
        {
            id: 2,
            name: "Fatima Sidi",
            role: "Business Graduate",
            text: "Thanks to Stage222, I found my first job right after graduation. The platform made it easy to connect with employers and showcase my skills."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            {/* <Navbar /> */}

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Login</h2>
                            <button
                                onClick={() => setIsLoginModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Tabs */}
                            <div className="flex border-b mb-6">
                                <button
                                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'student'
                                        ? 'text-[#00A55F] border-b-2 border-[#00A55F]'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => setActiveTab('student')}
                                >
                                    Student
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium text-sm text-gray-400 cursor-not-allowed`}
                                    disabled
                                >
                                    Employer
                                </button>
                            </div>

                            {/* Google Login Button */}
                            <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors mb-6">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Login with Google
                            </button>

                            {/* Divider */}
                            <div className="relative flex items-center justify-center mb-6">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            {/* Login Form */}
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Link to="/forgot-password" className="text-sm text-[#00A55F] hover:text-[#008c4f] transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium"
                                >
                                    Login
                                </button>
                            </form>

                            {/* Register Link */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    New to Stage222?{' '}
                                    <Link to="/register/student" className="text-[#00A55F] hover:text-[#008c4f] font-medium transition-colors">
                                        Register
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-[#00A55F]/10 to-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Welcome to Stage222
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Your platform for finding the best opportunities
                        </p>
                    </motion.div>
                    <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
                        <Link
                            to="/register/student"
                            className="bg-[#00A55F] text-white px-8 py-4 rounded-lg hover:bg-[#008c4f] transition-colors text-lg font-semibold shadow-md hover:shadow-lg"
                        >
                            Register as Student
                        </Link>
                        <Link
                            to="/register/employer"
                            className="bg-white text-[#00A55F] border-2 border-[#00A55F] px-8 py-4 rounded-lg hover:bg-[#00A55F]/5 transition-colors text-lg font-semibold shadow-md hover:shadow-lg"
                        >
                            Register as Employer
                        </Link>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg inline-block">
                        <p className="text-gray-700 mb-4 font-medium">Download our mobile app</p>
                        <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                            <span className="text-gray-400">QR Code</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marketing Comparison Section */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto w-full px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                        <div className="flex-1 flex flex-col items-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-6 text-center">The usual path</h3>
                            <img
                                src={BeforImg}
                                alt="Illustration of the usual job search path with obstacles and detours"
                                className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[90%] h-auto mx-auto"
                            />
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-center bg-gradient-to-r from-[#00A55F] to-[#34d399] bg-clip-text text-transparent select-none">
                                Stage222 🚀
                            </h3>
                            <div className="w-12 h-2 rounded-full bg-gradient-to-r from-[#00A55F] to-[#34d399] mb-4"></div>
                            <img
                                src={AfterImg}
                                alt="Illustration of the Stage222 path, direct and efficient to the right job"
                                className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[90%] h-auto mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Stage222 Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Why Stage222?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="w-12 h-12 bg-[#00A55F]/10 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Opportunities</h3>
                            <p className="text-gray-600">All internships and jobs are verified by our team to ensure quality and legitimacy.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="w-12 h-12 bg-[#00A55F]/10 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Guidance</h3>
                            <p className="text-gray-600">Get expert advice and resources to help you make informed career decisions.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="w-12 h-12 bg-[#00A55F]/10 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-[#00A55F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Focus</h3>
                            <p className="text-gray-600">Specifically designed for Mauritanian students and employers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">What Our Users Say</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {testimonials.map(testimonial => (
                            <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-[#00A55F]/10 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-[#00A55F] font-semibold">
                                            {testimonial.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">"{testimonial.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Internships Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Featured Internships</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {internships.map(internship => (
                            <div key={internship.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{internship.title}</h3>
                                <p className="text-[#00A55F] font-medium mb-2">{internship.company}</p>
                                <p className="text-gray-600 mb-4 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {internship.location}
                                </p>
                                <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {internship.duration}
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {internship.stipend}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/internships" className="text-[#00A55F] hover:text-[#008c4f] font-semibold inline-flex items-center">
                            View all internships
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Jobs Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Latest Jobs</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                                <p className="text-[#00A55F] font-medium mb-2">{job.company}</p>
                                <p className="text-gray-600 mb-4 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {job.location}
                                </p>
                                <p className="text-gray-500 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {job.salary}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/jobs" className="text-[#00A55F] hover:text-[#008c4f] font-semibold inline-flex items-center">
                            View all jobs
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Featured Courses</h2>
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-gray-700 mb-8 text-lg">
                            Enhance your skills with our curated selection of courses designed for Mauritanian students.
                            From technical skills to soft skills, we've got you covered.
                        </p>
                        <Link
                            to="/courses"
                            className="inline-flex items-center bg-[#00A55F] text-white px-8 py-4 rounded-lg hover:bg-[#008c4f] transition-colors text-lg font-semibold shadow-md hover:shadow-lg"
                        >
                            Explore Courses
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Resume Builder Promo */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Your Professional Resume</h2>
                        <p className="text-gray-700 mb-8 text-lg max-w-2xl mx-auto">
                            Stand out to employers with a professionally designed resume. Our easy-to-use resume builder helps you create a winning resume in minutes.
                        </p>
                        <Link
                            to="/resume-builder"
                            className="inline-flex items-center bg-[#00A55F] text-white px-8 py-4 rounded-lg hover:bg-[#008c4f] transition-colors text-lg font-semibold shadow-md hover:shadow-lg"
                        >
                            Build Your Resume
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Final CTA Banner */}
            <section className="py-20 bg-[#00A55F] text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Empower your future with Stage222</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                        Join thousands of Mauritanian students and employers who trust Stage222 for their career growth.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center bg-white text-[#00A55F] px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold shadow-md hover:shadow-lg"
                    >
                        Get Started Now
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold text-[#00A55F] mb-6">Stage222</h3>
                            <p className="text-gray-400">Mauritania's leading platform for internships and jobs.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
                            <ul className="space-y-4">
                                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    support@stage222.com
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +222 XX XX XX XX
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Nouakchott, Mauritania
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-6">Follow Us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Stage222. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
