import React, { useEffect, useState } from 'react';
import { fetchAdminOrganizations } from '../../../services/adminApi';
import OrganizationTable from '../components/OrganizationTable';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

const OrganizationModeration = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch organizations from the backend
    const getOrganizations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchAdminOrganizations();
            setOrganizations(res.data.results || res.data);
        } catch (err) {
            setError('Failed to load organizations.');
            toast.error('Failed to load organizations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrganizations();
    }, []);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Organization Moderation</h1>
                                <p className="text-gray-600 mt-1">View, verify, and manage all organizations</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    {loading && (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A55F]"></div>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-600 font-medium mb-4">{error}</div>
                    )}
                    {!loading && !error && <OrganizationTable organizations={organizations} onActionComplete={getOrganizations} />}
                </main>
            </div>
        </div>
    );
};

export default OrganizationModeration; 