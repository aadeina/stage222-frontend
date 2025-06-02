import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';

const Dashboard = () => {
    return (
        <PageWrapper className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Welcome to Stage222 Dashboard
                    </h1>
                    <p className="text-gray-600 mb-6">
                        This is your personal dashboard where you can manage your profile, applications, and more.
                    </p>

                    {/* Placeholder content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile</h2>
                            <p className="text-gray-600">Complete your profile to increase your chances of getting hired.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Applications</h2>
                            <p className="text-gray-600">Track your job and internship applications.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Saved Jobs</h2>
                            <p className="text-gray-600">View and manage your saved job listings.</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
};

export default Dashboard; 