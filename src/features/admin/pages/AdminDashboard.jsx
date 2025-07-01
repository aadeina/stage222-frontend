import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaBuilding,
    FaBriefcase,
    FaGraduationCap,
    FaChartLine,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaSyncAlt,
    FaEye,
    FaCog,
    FaShieldAlt,
    FaTrophy,
    FaRocket,
    FaChartBar,
    FaUserShield,
    FaClipboardCheck
} from 'react-icons/fa';
import { fetchPlatformStats } from '../../../services/adminApi';
import AnalyticsCards from '../components/AnalyticsCards';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';
import Stage222Logo from '@/assets/images/Stage222RecuiterLogo.png';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Mock data for development/demo purposes
    const mockStats = {
        users: {
            total: 1250,
            by_role: {
                admin: 5,
                recruiter: 45,
                candidate: 1200
            },
            verified: 1180
        },
        organizations: {
            total: 67,
            verified: 52,
            unverified: 15
        },
        internships: {
            total: 89,
            pending: 12,
            approved: 77
        },
        jobs: {
            total: 156,
            pending: 8,
            approved: 148
        },
        applications: {
            total: 2340,
            pending: 156,
            accepted: 1890,
            rejected: 294
        },
        growth: {
            users: '+12%',
            opportunities: '+8%',
            applications: '+15%',
            engagement: '94%'
        }
    };

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchPlatformStats();
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to load platform stats.');
            toast.error('Failed to load platform statistics');

            // Set mock data for development/demo purposes
            setStats({
                users: {
                    total: 1250,
                    by_role: {
                        admin: 5,
                        recruiter: 45,
                        candidate: 1200
                    },
                    verified: 1180
                },
                organizations: {
                    total: 67,
                    verified: 52,
                    unverified: 15
                },
                internships: {
                    total: 89,
                    pending: 12,
                    approved: 77
                },
                jobs: {
                    total: 156,
                    pending: 8,
                    approved: 148
                },
                applications: {
                    total: 2340,
                    pending: 156,
                    accepted: 1890,
                    rejected: 294
                },
                growth: {
                    users: '+12%',
                    opportunities: '+8%',
                    applications: '+15%',
                    engagement: '94%'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await getStats();
            toast.success('Dashboard refreshed successfully!');
        } catch (error) {
            toast.error('Failed to refresh dashboard');
        } finally {
            setIsRefreshing(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'verified':
                return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 shadow-green-200/50';
            case 'pending':
                return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-yellow-400 shadow-yellow-200/50';
            case 'inactive':
            case 'unverified':
                return 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-400 shadow-red-200/50';
            default:
                return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400 shadow-gray-200/50';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-[#00A55F] border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 text-lg font-medium">Loading platform analytics...</p>
                    <p className="text-gray-500 text-sm mt-2">Gathering comprehensive data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-3xl font-bold text-gray-900"
                                >
                                    Admin Dashboard
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="text-gray-600 mt-1"
                                >
                                    Platform overview and analytics
                                    {error && <span className="ml-2 text-yellow-600 text-sm">(Demo data)</span>}
                                </motion.p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white rounded-xl hover:from-[#008c4f] hover:to-[#007a43] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 font-medium"
                            >
                                <motion.div
                                    animate={{ rotate: isRefreshing ? 360 : 0 }}
                                    transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                                >
                                    <FaSyncAlt className="h-4 w-4" />
                                </motion.div>
                                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-red-800">Error Loading Data</h3>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Platform Overview Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Total Users Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {typeof stats?.users === 'object' ? stats?.users?.total || 0 : stats?.users || 0}
                                        </p>
                                        {typeof stats?.users === 'object' && stats?.users?.by_role && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {Object.entries(stats.users.by_role).map(([role, count]) => (
                                                    <span key={role} className="inline-block bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs font-medium">
                                                        {role.charAt(0).toUpperCase() + role.slice(1)}: {count}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {typeof stats?.users === 'object' && stats?.users?.verified && (
                                            <div className="mt-2 flex items-center gap-1">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                                                    <FaCheckCircle className="h-3 w-3" />
                                                    {stats.users.verified} Verified
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                                        <FaUsers className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Organizations Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Organizations</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {typeof stats?.organizations === 'object' ? stats?.organizations?.total || 0 : stats?.organizations || 0}
                                        </p>
                                        {typeof stats?.organizations === 'object' && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {stats.organizations.verified && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                                                        <FaCheckCircle className="h-3 w-3" />
                                                        {stats.organizations.verified} Verified
                                                    </span>
                                                )}
                                                {stats.organizations.unverified && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">
                                                        <FaClock className="h-3 w-3" />
                                                        {stats.organizations.unverified} Pending
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                                        <FaBuilding className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Opportunities Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Opportunities</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {(typeof stats?.internships === 'object' ? stats?.internships?.total || 0 : stats?.internships || 0) +
                                                (typeof stats?.jobs === 'object' ? stats?.jobs?.total || 0 : stats?.jobs || 0)}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            <span className="inline-block bg-purple-50 text-purple-700 rounded-full px-2 py-1 text-xs font-medium">
                                                {typeof stats?.internships === 'object' ? stats?.internships?.total || 0 : stats?.internships || 0} Internships
                                            </span>
                                            <span className="inline-block bg-pink-50 text-pink-700 rounded-full px-2 py-1 text-xs font-medium">
                                                {typeof stats?.jobs === 'object' ? stats?.jobs?.total || 0 : stats?.jobs || 0} Jobs
                                            </span>
                                            {typeof stats?.internships === 'object' && stats?.internships?.pending && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">
                                                    <FaClock className="h-3 w-3" />
                                                    {stats.internships.pending} Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                                        <FaBriefcase className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Applications Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">Applications</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {typeof stats?.applications === 'object' ? stats?.applications?.total || 0 : stats?.applications || 0}
                                        </p>
                                        {typeof stats?.applications === 'object' && stats?.applications?.pending && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">
                                                    <FaClock className="h-3 w-3" />
                                                    {stats.applications.pending} Pending
                                                </span>
                                                {stats.applications.accepted && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                                                        <FaCheckCircle className="h-3 w-3" />
                                                        {stats.applications.accepted} Accepted
                                                    </span>
                                                )}
                                                {stats.applications.rejected && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full">
                                                        <FaExclamationTriangle className="h-3 w-3" />
                                                        {stats.applications.rejected} Rejected
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                                        <FaGraduationCap className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Growth & Performance Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Growth & Performance</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Growth Metrics */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Platform Growth</h3>
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FaChartLine className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-900">
                                            {stats?.growth?.users || '0%'}
                                        </p>
                                        <p className="text-sm text-blue-700">User Growth</p>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                        <p className="text-2xl font-bold text-green-900">
                                            {stats?.growth?.opportunities || '0%'}
                                        </p>
                                        <p className="text-sm text-green-700">Opportunity Growth</p>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                                        <p className="text-2xl font-bold text-purple-900">
                                            {stats?.growth?.applications || '0%'}
                                        </p>
                                        <p className="text-sm text-purple-700">Application Growth</p>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                                        <p className="text-2xl font-bold text-orange-900">
                                            {stats?.growth?.engagement || '0%'}
                                        </p>
                                        <p className="text-sm text-orange-700">Engagement Rate</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    {/* User Management Quick Action */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => window.location.href = '/admin/users'}
                                        className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-lg transition-all duration-200 group"
                                    >
                                        <div className="p-2 bg-yellow-500 rounded-lg group-hover:scale-110 transition-transform">
                                            <FaUsers className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-yellow-900">Manage Users</p>
                                            <p className="text-xs text-yellow-700">View, verify, and edit users</p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200 group"
                                    >
                                        <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                                            <FaEye className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-blue-900">View Users</p>
                                            <p className="text-xs text-blue-700">Manage user accounts</p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all duration-200 group"
                                    >
                                        <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                                            <FaShieldAlt className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-green-900">Moderate Content</p>
                                            <p className="text-xs text-green-700">Review opportunities</p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all duration-200 group"
                                    >
                                        <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                                            <FaCog className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-purple-900">Platform Settings</p>
                                            <p className="text-xs text-purple-700">Configure system</p>
                                        </div>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Platform Health Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Platform Health</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-green-600">All Systems Operational</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                                <FaTrophy className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-900">Performance</p>
                                    <p className="text-sm text-green-700">Excellent</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                <FaRocket className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-blue-900">Uptime</p>
                                    <p className="text-sm text-blue-700">99.9%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                                <FaShieldAlt className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="font-medium text-purple-900">Security</p>
                                    <p className="text-sm text-purple-700">Protected</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard; 