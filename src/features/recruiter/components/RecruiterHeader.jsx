import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/images/MainStage222Logo.png';
import { useAuth } from '../../../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const steps = [
    'Personal Details',
    'Organization Details',
    'Post Internship/Job',
];

const RecruiterHeader = ({ title, subtitle }) => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{title || 'Dashboard'}</h1>
                        {subtitle && (
                            <p className="text-gray-600">{subtitle}</p>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-[#00A55F] rounded-full flex items-center justify-center">
                                <FaUser className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-gray-900">{user?.first_name || 'Recruiter'}</p>
                                <p className="text-gray-500">{user?.organization?.name || 'Your Organization'}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <FaSignOutAlt className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default RecruiterHeader; 