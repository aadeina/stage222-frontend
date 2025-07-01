import React, { useEffect, useState } from 'react';
import { fetchPendingInternships } from '../../../services/adminApi';
import AdminLayout from '../components/AdminLayout';
import InternshipTable from '../components/InternshipTable';
import toast from 'react-hot-toast';

const InternshipModeration = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getInternships = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchPendingInternships();
            setInternships(res.data);
        } catch (err) {
            setError('Failed to load internships.');
            toast.error('Failed to load internships.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getInternships();
    }, []);

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-6">Internship Moderation</h1>
            {loading && (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
            )}
            {error && (
                <div className="text-red-600 font-medium mb-4">{error}</div>
            )}
            {!loading && !error && <InternshipTable internships={internships} onActionComplete={getInternships} />}
        </AdminLayout>
    );
};

export default InternshipModeration; 