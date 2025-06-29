import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { FaComments, FaBriefcase, FaUsers, FaCheckCircle, FaEye, FaEdit, FaTrash, FaChartBar, FaUser, FaBuilding, FaLock, FaCreditCard, FaSignOutAlt } from 'react-icons/fa';
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

    // Mock data for development
    const mockDashboardStats = {
        totalOpportunities: 12,
        totalApplications: 156,
        shortlistedCandidates: 23,
        totalHires: 8
    };

    const mockRecentOpportunities = [
        {
            id: 1,
            title: "Frontend Developer Intern",
            type: "Internship",
            applicants_count: 45,
            postedDate: "2024-01-15",
            status: "Active"
        },
        {
            id: 2,
            title: "Full Stack Developer",
            type: "Job",
            applicants_count: 32,
            postedDate: "2024-01-10",
            status: "Active"
        },
        {
            id: 3,
            title: "UI/UX Designer",
            type: "Internship",
            applicants_count: 28,
            postedDate: "2024-01-08",
            status: "Draft"
        },
        {
            id: 4,
            title: "Data Analyst",
            type: "Job",
            applicants_count: 19,
            postedDate: "2024-01-05",
            status: "Closed"
        }
    ];

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
            // Try to fetch real data from API
            const [statsResponse, opportunitiesResponse] = await Promise.all([
                getDashboardStats(),
                getRecentOpportunities()
            ]);

            setDashboardStats(statsResponse.data);
            setRecentOpportunities(opportunitiesResponse.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);

            // Fall back to mock data for development
            console.log('Using mock data for development');
            setDashboardStats(mockDashboardStats);
            setRecentOpportunities(mockRecentOpportunities);

            // Only show error toast if it's not a development fallback
            if (process.env.NODE_ENV === 'production') {
                toast.error('Failed to load dashboard data');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'Closed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type) => {
        return type === 'Internship' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
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
                                        {recentOpportunities.map((opportunity) => (
                                            <tr key={opportunity.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {opportunity.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(opportunity.type)}`}>
                                                        {opportunity.type}
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
                                                    {new Date(opportunity.postedDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(opportunity.status)}`}>
                                                        {opportunity.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button className="text-[#00A55F] hover:text-[#008c4f]">
                                                            <FaEye className="h-4 w-4" />
                                                        </button>
                                                        <button className="text-blue-600 hover:text-blue-800">
                                                            <FaEdit className="h-4 w-4" />
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-800">
                                                            <FaTrash className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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
                                        {recentOpportunities.filter(opp => opp.status === 'Active').length}
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