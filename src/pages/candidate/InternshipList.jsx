import { useEffect, useState } from 'react';
import InternshipCard from '@/components/InternshipCard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchInternships } from '@/services/internshipApi';

const InternshipList = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInternships = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchInternships();
                setInternships(res.data.results || res.data || []);
            } catch (err) {
                setError('Failed to load internships.');
                toast.error('Failed to load internships.');
            } finally {
                setLoading(false);
            }
        };
        loadInternships();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Latest Internships</h1>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <motion.div key={i} className="h-36 bg-white rounded-2xl shadow border border-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-12">{error}</div>
                ) : internships.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">No internships found.</div>
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.08 } },
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    >
                        {internships.map((internship) => (
                            <motion.div key={internship.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                                <InternshipCard
                                    internship={internship}
                                    onClick={() => window.location.href = `/internships/${internship.id}`}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default InternshipList; 