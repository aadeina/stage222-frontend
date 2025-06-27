import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/images/MainStage222Logo.png';

const steps = [
    'Personal Details',
    'Organization Details',
    'Post Internship/Job',
];

export default function RecruiterHeader({ currentStep = 0, user = {} }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    // Close menu on outside click
    // (You can add useEffect for click outside if needed)

    return (
        <header className="w-full bg-white border-b border-gray-100 shadow-sm z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Stage222 Logo" className="h-10 w-auto" />
                    <span className="text-xl font-bold text-[#00A55F] tracking-tight">Stage222 Recruiter</span>
                </div>
                {/* Stepper */}
                <nav className="flex-1 flex justify-center">
                    <ol className="flex items-center gap-8">
                        {steps.map((step, idx) => (
                            <li key={step} className="flex items-center gap-2">
                                <motion.div
                                    animate={{
                                        backgroundColor: idx <= currentStep ? '#00A55F' : '#E5E7EB',
                                        color: idx <= currentStep ? '#fff' : '#6B7280',
                                    }}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${idx <= currentStep
                                            ? 'border-[#00A55F] shadow-md'
                                            : 'border-gray-300'
                                        }`}
                                >
                                    {idx + 1}
                                </motion.div>
                                <span className={`font-medium text-sm ${idx <= currentStep ? 'text-[#00A55F]' : 'text-gray-500'}`}>{step}</span>
                                {idx < steps.length - 1 && (
                                    <span className="w-8 h-1 bg-gray-200 rounded-full mx-1" />
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#00A55F] flex items-center justify-center text-white font-bold">
                            {user?.name ? user.name[0].toUpperCase() : 'R'}
                        </div>
                        <span className="hidden md:block text-gray-700 font-medium text-sm">{user?.name || 'Recruiter'}</span>
                        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.18 }}
                                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2"
                            >
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <div className="font-semibold text-gray-900 text-sm">{user?.name || 'Recruiter'}</div>
                                    <div className="text-xs text-gray-500">{user?.email || 'recruiter@email.com'}</div>
                                </div>
                                <button onClick={() => navigate('/recruiter/profile')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit Profile</button>
                                <button onClick={() => navigate('/recruiter/change-password')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Change Password</button>
                                <button onClick={() => navigate('/recruiter/billing')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Billing</button>
                                <button onClick={() => navigate('/recruiter/help')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Help Center</button>
                                <div className="border-t border-gray-100 my-1" />
                                <button onClick={() => {/* handle logout */ }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
} 