import React, { useEffect, useState } from 'react';
import { fetchPlatformStats } from '../../../services/adminApi';
import AnalyticsCards from '../components/AnalyticsCards';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchPlatformStats();
                setStats(res.data);
            } catch (err) {
                setError('Failed to load platform stats.');
            } finally {
                setLoading(false);
            }
        };
        getStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            {loading && (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
            )}
            {error && (
                <div className="text-red-600 font-medium mb-4">{error}</div>
            )}
            {stats && <AnalyticsCards stats={stats} />}
        </div>
    );
};

export default AdminDashboard; 