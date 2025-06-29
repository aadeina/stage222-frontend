import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { FaComments, FaBriefcase, FaUsers, FaCheckCircle, FaEye, FaEdit, FaTrash, FaChartBar, FaUser, FaBuilding, FaLock, FaCreditCard, FaSignOutAlt, FaSyncAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getDashboardStats, getRecentOpportunities } from '../api/dashboardApi';
import RecruiterHeader from '../components/RecruiterHeader';
import api from '../../../services/api';

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [dashboardStats, setDashboardStats] = useState(null);
    const [recentOpportunities, setRecentOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        // Check if user is authenticated and is a recruiter
        if (!user || user.role !== 'recruiter') {
            navigate('/login');
            return;
        }

        fetchDashboardData();
    }, [user, navigate]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch real data from API
            const [statsResponse, opportunitiesResponse] = await Promise.all([
                getDashboardStats(),
                getRecentOpportunities()
            ]);

            console.log('Dashboard Stats:', statsResponse.data);
            console.log('Recent Opportunities:', opportunitiesResponse.data);

            // Handle the data structure properly
            const opportunities = Array.isArray(opportunitiesResponse.data)
                ? opportunitiesResponse.data
                : opportunitiesResponse.data.results || opportunitiesResponse.data.opportunities || [];

            console.log('Processed Opportunities:', opportunities);
            console.log('Opportunities Count:', opportunities.length);

            setDashboardStats(statsResponse.data);
            setRecentOpportunities(opportunities);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchDashboardData();
            toast.success('Dashboard refreshed successfully!');
        } catch (error) {
            toast.error('Failed to refresh dashboard');
        } finally {
            setIsRefreshing(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'draft':
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'closed':
            case 'inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type) => {
        const opportunityType = type?.toLowerCase();
        return opportunityType === 'internship' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
    };

    const formatStatus = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'Active';
            case 'closed':
                return 'Closed';
            case 'draft':
                return 'Draft';
            case 'pending':
                return 'Pending';
            default:
                return status || 'Unknown';
        }
    };

    const formatType = (type) => {
        const opportunityType = type?.toLowerCase();
        return opportunityType === 'internship' ? 'Internship' : 'Job';
    };

    const getOpportunityType = (opportunity) => {
        // Handle both opportunity_type and type fields
        return opportunity.opportunity_type || opportunity.type || 'job';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A55F] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            {/* <RecruiterHeader
                title="Dashboard"
                subtitle={`Welcome back, ${user?.first_name || 'Recruiter'} 👋`}
            /> */}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {user?.first_name || 'Recruiter'} 👋</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors disabled:opacity-50"
                    >
                        <motion.div
                            animate={{ rotate: isRefreshing ? 360 : 0 }}
                            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                        >
                            <FaSyncAlt className="h-4 w-4" />
                        </motion.div>
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </motion.button>
                </div>

                {/* Dashboard Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardStats?.totalOpportunities || 0}</p>
                            </div>
                            <div className="p-3 bg-[#00A55F]/10 rounded-lg">
                                <FaBriefcase className="h-6 w-6 text-[#00A55F]" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardStats?.totalApplications || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FaUsers className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardStats?.shortlistedCandidates || 0}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <FaChartBar className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Hires</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardStats?.totalHires || 0}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FaCheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Debug Section - Remove in production */}
                {process.env.NODE_ENV === 'development' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                    >
                        <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info (Development Only)</h3>
                        <div className="text-xs text-yellow-700 space-y-1">
                            <p>Opportunities Count: {recentOpportunities.length}</p>
                            <p>Dashboard Stats: {JSON.stringify(dashboardStats)}</p>
                            <p>First Opportunity: {recentOpportunities[0] ? JSON.stringify(recentOpportunities[0], null, 2) : 'None'}</p>
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recently Posted Jobs/Internships */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Recently Posted Opportunities</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center gap-1">
                                                    <span>Applicants</span>
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full" title="Competition level indicator"></div>
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Posted
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentOpportunities.length > 0 ? (
                                            recentOpportunities.map((opportunity) => (
                                                <tr key={opportunity.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {opportunity.title}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(getOpportunityType(opportunity))}`}>
                                                            {formatType(getOpportunityType(opportunity))}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1">
                                                                <FaUsers className="h-3 w-3 text-gray-400" />
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {opportunity.applicants_count || 0}
                                                                </span>
                                                            </div>
                                                            {/* Competition Level Indicator */}
                                                            <div className={`w-2 h-2 rounded-full ${opportunity.applicants_count > 20 ? 'bg-red-500' :
                                                                opportunity.applicants_count > 10 ? 'bg-yellow-500' : 'bg-green-500'
                                                                }`} />
                                                            <span className={`text-xs font-medium ${opportunity.applicants_count > 20 ? 'text-red-600' :
                                                                opportunity.applicants_count > 10 ? 'text-yellow-600' : 'text-green-600'
                                                                }`}>
                                                                {opportunity.applicants_count > 20 ? 'High' :
                                                                    opportunity.applicants_count > 10 ? 'Med' : 'Low'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(opportunity.created_at || opportunity.postedDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(opportunity.status)}`}>
                                                            {formatStatus(opportunity.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => navigate(`/internships/${opportunity.id}`)}
                                                                className="text-[#00A55F] hover:text-[#008c4f] transition-colors"
                                                                title="View Details"
                                                            >
                                                                <FaEye className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => navigate(`/recruiter/edit-opportunity/${opportunity.id}`)}
                                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                                title="Edit Opportunity"
                                                            >
                                                                <FaEdit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => navigate(`/recruiter/applicants/${opportunity.id}`)}
                                                                className="text-purple-600 hover:text-purple-800 transition-colors"
                                                                title="View Applicants"
                                                            >
                                                                <FaUsers className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center">
                                                    <div className="text-gray-500">
                                                        <FaBriefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                        <p className="text-lg font-medium">No opportunities found</p>
                                                        <p className="text-sm">Start posting opportunities to see them here</p>
                                                        <button
                                                            onClick={() => navigate('/recruiter/post-opportunity')}
                                                            className="mt-4 px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors"
                                                        >
                                                            Post Your First Opportunity
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Applications Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Overview</h3>

                            {/* Applicants Statistics */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-700">Total Applicants</span>
                                    </div>
                                    <span className="text-lg font-bold text-blue-600">
                                        {recentOpportunities.reduce((sum, opp) => sum + (opp.applicants_count || 0), 0)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium text-gray-700">Active Posts</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">
                                        {recentOpportunities.filter(opp => opp.status?.toLowerCase() === 'open').length}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FaChartBar className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm font-medium text-gray-700">Avg. per Post</span>
                                    </div>
                                    <span className="text-lg font-bold text-yellow-600">
                                        {Math.round(recentOpportunities.reduce((sum, opp) => sum + (opp.applicants_count || 0), 0) / Math.max(recentOpportunities.length, 1))}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/recruiter/applicants')}
                                className="w-full bg-[#00A55F] text-white px-4 py-2 rounded-lg hover:bg-[#008c4f] transition-colors font-medium"
                            >
                                View All Applicants
                            </button>
                        </motion.div>

                        {/* Chat Shortcut */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <div className="text-center">
                                <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
                                    <FaComments className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
                                <p className="text-sm text-gray-600 mb-4">Stay connected with candidates</p>
                                <button
                                    onClick={() => navigate('/messages')}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Go to Inbox
                                </button>
                            </div>
                        </motion.div>

                        {/* Manage Account */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Account</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/recruiter/profile')}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FaUser className="h-4 w-4 text-gray-500" />
                                    <span>View Profile</span>
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            // Fetch current recruiter data to get organization ID
                                            const response = await api.get('/recruiters/me/');
                                            const recruiterData = response.data.data || response.data;

                                            if (recruiterData?.organization) {
                                                // Navigate to edit page with organization ID
                                                navigate(`/recruiter/organization/${recruiterData.organization}/update`);
                                            } else {
                                                toast.error('No organization found. Please contact support.');
                                            }
                                        } catch (error) {
                                            console.error('Error fetching recruiter data:', error);
                                            // Fallback to cleaner route that fetches data internally
                                            navigate('/recruiter/organization/edit');
                                        }
                                    }}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FaBuilding className="h-4 w-4 text-gray-500" />
                                    <span>Edit Organization</span>
                                </button>
                                <button
                                    onClick={() => navigate('/recruiter/change-password')}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FaLock className="h-4 w-4 text-gray-500" />
                                    <span>Change Password</span>
                                </button>
                                <button
                                    onClick={() => navigate('/recruiter/billing')}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FaCreditCard className="h-4 w-4 text-gray-500" />
                                    <span>Billing</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FaSignOutAlt className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RecruiterDashboard; 