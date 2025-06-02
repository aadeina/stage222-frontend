import { motion } from 'framer-motion';
import Navbar from './Navbar';

const PageWrapper = ({ children, className = '' }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
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