import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const SetupComplete = ({ organizationName, onContinue }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6"
        >
            <div className="flex justify-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-16 h-16 bg-[#00A55F] rounded-full flex items-center justify-center"
                >
                    <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </motion.div>
            </div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-semibold text-gray-900"
            >
                Setup Complete!
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 max-w-md mx-auto"
            >
                Congratulations! Your organization {organizationName} has been successfully set up.
                You can now start posting internships and managing your recruitment process.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
            >
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <svg
                        className="w-5 h-5 text-[#00A55F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Organization profile created</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <svg
                        className="w-5 h-5 text-[#00A55F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Account verified</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <svg
                        className="w-5 h-5 text-[#00A55F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Ready to post internships</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-6"
            >
                <button
                    onClick={onContinue}
                    className="px-6 py-2.5 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors"
                >
                    Continue to Dashboard
                </button>
            </motion.div>
        </motion.div>
    );
};

SetupComplete.propTypes = {
    organizationName: PropTypes.string.isRequired,
    onContinue: PropTypes.func.isRequired
};

export default SetupComplete; 