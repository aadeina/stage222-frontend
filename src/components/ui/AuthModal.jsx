import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUserGraduate, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, onContinue }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Sign up to Apply</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaTimes className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#00A55F] rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUserGraduate className="text-white text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Create your account to apply
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Join thousands of students finding their dream internships on Stage222
                        </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        <Link
                            to="/register/student"
                            onClick={onClose}
                            className="flex items-center gap-3 w-full p-4 border border-gray-200 rounded-xl hover:border-[#00A55F] hover:bg-green-50 transition-all group"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaUserGraduate className="text-blue-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-gray-900 group-hover:text-[#00A55F]">
                                    I'm a Student
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Find internships and start your career
                                </p>
                            </div>
                        </Link>

                        <Link
                            to="/register/employer"
                            onClick={onClose}
                            className="flex items-center gap-3 w-full p-4 border border-gray-200 rounded-xl hover:border-[#00A55F] hover:bg-green-50 transition-all group"
                        >
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <FaBuilding className="text-purple-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-gray-900 group-hover:text-[#00A55F]">
                                    I'm an Employer
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Post internships and hire talent
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-3">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="text-[#00A55F] hover:text-[#008c4f] font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                        <button
                            onClick={onClose}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthModal; 