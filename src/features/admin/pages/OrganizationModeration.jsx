import React, { useEffect, useState } from 'react';
import { fetchAdminOrganizations } from '../../../services/adminApi';
import OrganizationTable from '../components/OrganizationTable';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';
import AdminProfileDropdown from '../components/AdminProfileDropdown';
import { FaBuilding, FaCheckCircle, FaTimesCircle, FaEye, FaSync } from 'react-icons/fa';
import { motion } from 'framer-motion';

const OrganizationModeration = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        verified: 0,
        unverified: 0,
        independent: 0
    });

    // Fetch organizations from the backend
    const getOrganizations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchAdminOrganizations();
            const orgData = res.data.results || res.data;
            setOrganizations(orgData);

            // Calculate statistics
            const total = orgData.length;
            const verified = orgData.filter(org => org.is_verified).length;
            const unverified = total - verified;
            const independent = orgData.filter(org => org.is_independent).length;

            setStats({ total, verified, unverified, independent });
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
                                <p className="text-gray-600 mt-1">View, verify, and manage all organizations on Stage222</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={getOrganizations}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <FaSync className="h-4 w-4" />
                                    Refresh
                                </motion.button>
                                <AdminProfileDropdown />
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
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="space-y-6">
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">Total Organizations</p>
                                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                        </div>
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <FaBuilding className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">Verified</p>
                                            <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
                                        </div>
                                        <div className="p-3 bg-green-100 rounded-lg">
                                            <FaCheckCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">Pending Verification</p>
                                            <p className="text-3xl font-bold text-yellow-600">{stats.unverified}</p>
                                        </div>
                                        <div className="p-3 bg-yellow-100 rounded-lg">
                                            <FaTimesCircle className="h-6 w-6 text-yellow-600" />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">Independent</p>
                                            <p className="text-3xl font-bold text-purple-600">{stats.independent}</p>
                                        </div>
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <FaEye className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Organizations Table */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                <OrganizationTable
                                    organizations={organizations}
                                    onActionComplete={getOrganizations}
                                />
                            </motion.div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default OrganizationModeration; 