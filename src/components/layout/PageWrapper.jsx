import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import RecruiterHeader from '@/features/recruiter/components/RecruiterHeader';

const PageWrapper = ({ children, className = '' }) => {
    const location = useLocation();
    const isRecruiterRoute = location.pathname.startsWith('/recruiter');

    return (
        <div className="min-h-screen bg-gray-50">
            {isRecruiterRoute ? (
                <RecruiterHeader /> // TODO: Use minimal logo for recruiter if available
            ) : (
                <Navbar />
            )}
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={className}
            >
                {children}
            </motion.main>
        </div>
    );
};

export default PageWrapper; 