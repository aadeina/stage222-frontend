import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { FaBriefcase, FaUsers, FaCheckCircle, FaEye, FaEdit, FaTrash, FaChartBar, FaUser, FaBuilding, FaLock, FaCreditCard, FaSignOutAlt, FaSyncAlt, FaTimes, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getDashboardStats, getRecentOpportunities } from '../api/dashboardApi';
import RecruiterHeader from '../components/RecruiterHeader';
import RejectionReasonModal from '../components/RejectionReasonModal';
import api from '../../../services/api';
import VerifiedBadge from '@/components/VerifiedBadge';
import { deleteInternship } from '@/services/internshipApi';

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [dashboardStats, setDashboardStats] = useState(null);
    const [recentOpportunities, setRecentOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [recruiterData, setRecruiterData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [selectedRejectedOpportunity, setSelectedRejectedOpportunity] = useState(null);
    const [shortlistedCount, setShortlistedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        // Check if user is authenticated and is a recruiter
        if (!user || user.role !== 'recruiter') {
            navigate('/login');
            return;
        }

        fetchDashboardData();
        fetchRecruiterData();
        // Fetch counts for each status
        api.get('/applications/recruiter/?shortlisted=true')
            .then(res => setShortlistedCount(res.data.count || 0));
        api.get('/applications/recruiter/?status=rejected')
            .then(res => setRejectedCount(res.data.count || 0));
        api.get('/applications/recruiter/?status=pending&shortlisted=false')
            .then(res => setPendingCount(res.data.count || 0));
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
            toast.error(t('recruiter.failedToLoadData'));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecruiterData = async () => {
        try {
            const response = await api.get('/recruiters/me/');
            setRecruiterData(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching recruiter data:', error);
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
            toast.success(t('recruiter.dashboardRefreshed'));
        } catch (error) {
            toast.error(t('recruiter.failedToRefresh'));
        } finally {
            setIsRefreshing(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
            case 'active':
                return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 shadow-green-200/50';
            case 'draft':
            case 'pending':
                return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-yellow-400 shadow-yellow-200/50';
            case 'closed':
            case 'inactive':
                return 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-400 shadow-red-200/50';
            default:
                return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400 shadow-gray-200/50';
        }
    };

    const getApprovalStatusColor = (approvalStatus) => {
        switch (approvalStatus?.toLowerCase()) {
            case 'approved':
                return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 shadow-green-200/50';
            case 'pending':
                return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-yellow-400 shadow-yellow-200/50';
            case 'rejected':
                return 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-400 shadow-red-200/50';
            default:
                return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400 shadow-gray-200/50';
        }
    };

    const getTypeColor = (type) => {
        const opportunityType = type?.toLowerCase();
        return opportunityType === 'internship' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
    };

    const formatStatus = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return t('recruiterDashboard.status.active');
            case 'closed':
                return t('recruiterDashboard.status.closed');
            case 'draft':
                return t('recruiterDashboard.status.draft');
            case 'pending':
                return t('recruiterDashboard.status.pending');
            default:
                return status || t('common.unknown');
        }
    };

    const formatApprovalStatus = (approvalStatus) => {
        switch (approvalStatus?.toLowerCase()) {
            case 'approved':
                return t('recruiterDashboard.approvalStatus.approved');
            case 'pending':
                return t('recruiterDashboard.approvalStatus.pendingApproval');
            case 'rejected':
                return t('recruiterDashboard.approvalStatus.rejected');
            default:
                return approvalStatus || t('common.unknown');
        }
    };

    const formatType = (type) => {
        const opportunityType = type?.toLowerCase();
        return opportunityType === 'internship' ? t('recruiterDashboard.type.internship') : t('recruiterDashboard.type.job');
    };

    const getOpportunityType = (opportunity) => {
        // Handle both opportunity_type and type fields
        return opportunity.opportunity_type || opportunity.type || 'job';
    };

    // Delete handler
    const handleDeleteOpportunity = async () => {
        if (!selectedOpportunity) return;
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            await deleteInternship(selectedOpportunity.id);
            toast.success(t('recruiter.opportunityDeleted'));
            setShowDeleteModal(false);
            setSelectedOpportunity(null);
            // Refresh list
            fetchDashboardData();
        } catch (err) {
            setDeleteError(t('recruiter.failedToDelete'));
        } finally {
            setDeleteLoading(false);
        }
    };

    // Rejection reason handler
    const handleViewRejectionReason = (opportunity) => {
        setSelectedRejectedOpportunity(opportunity);
        setShowRejectionModal(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A55F] mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('recruiter.loadingDashboard')}</p>
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
                        <h1 className="text-2xl font-bold text-gray-900">{t('recruiter.dashboard')}</h1>
                        <p className="text-gray-600">{t('recruiter.welcomeBack')}, {user?.first_name || t('auth.employer')} 👋</p>
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
                        <span>{isRefreshing ? t('recruiterDashboard.refreshing') : t('recruiterDashboard.refresh')}</span>
                    </motion.button>
                </div>

                {/* Dashboard Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{t('recruiterDashboard.stats.totalOpportunities')}</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardStats?.total_opportunities || 0}</p>
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
                                <p className="text-sm font-medium text-gray-600">{t('recruiterDashboard.stats.totalApplications')}</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardStats?.total_applications || 0}</p>
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
                                <p className="text-sm font-medium text-gray-600">{t('recruiterDashboard.stats.shortlisted')}</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardStats?.shortlisted || 0}</p>
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
                                <p className="text-sm font-medium text-gray-600">{t('recruiterDashboard.stats.totalHires')}</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardStats?.total_hires || 0}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FaCheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Approval Status Notifications */}
                {recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'pending').length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FaClock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-yellow-800">
                                    {t('recruiter.pendingApprovals')} ({recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'pending').length})
                                </h3>
                                <p className="text-sm text-yellow-700">
                                    {t('recruiter.pendingApprovalsMessage', {
                                        count: recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'pending').length,
                                        plural: recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'pending').length !== 1 ? 'ies' : 'y'
                                    })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Success Notifications */}
                {recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'approved').length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FaCheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-green-800">
                                    {t('recruiter.successfullyApproved')} ({recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'approved').length})
                                </h3>
                                <p className="text-sm text-green-700">
                                    {t('recruiter.successfullyApprovedMessage', {
                                        count: recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'approved').length,
                                        plural: recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'approved').length !== 1 ? 'ies' : 'y',
                                        verb: recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'approved').length !== 1 ? 'are' : 'is'
                                    })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Rejection Notifications */}
                {recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'rejected').length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-red-800">
                                    {t('recruiter.rejectedOpportunities')} ({recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'rejected').length})
                                </h3>
                                <p className="text-sm text-red-700">
                                    {t('recruiter.rejectedOpportunitiesMessage', {
                                        count: recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'rejected').length,
                                        plural: recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'rejected').length !== 1 ? 'ies' : 'y',
                                        verb: recentOpportunities.filter(opp => opp.approval_status?.toLowerCase() === 'rejected').length !== 1 ? 'were' : 'was'
                                    })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-8">
                    {/* All Posted Opportunities - Full Width */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">{t('recruiter.allPostedOpportunities')}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>{t('recruiterDashboard.status.active')}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                            <span>{t('recruiterDashboard.status.pending')}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span>{t('recruiterDashboard.status.closed')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('common.title')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('common.type')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <span>{t('common.applicants')}</span>
                                                <div className="w-2 h-2 bg-gray-300 rounded-full" title="Competition level indicator"></div>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('common.posted')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('common.status')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('common.approval')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('common.actions')}
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
                                                            {opportunity.applicants_count > 20 ? t('recruiter.high') :
                                                                opportunity.applicants_count > 10 ? t('recruiter.medium') : t('recruiter.low')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(opportunity.created_at || opportunity.postedDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full border shadow-sm ${getStatusColor(opportunity.status)}`}>
                                                            {opportunity.status?.toLowerCase() === 'open' ? (
                                                                <FaCheckCircle className="h-3 w-3" />
                                                            ) : opportunity.status?.toLowerCase() === 'closed' ? (
                                                                <FaTimes className="h-3 w-3" />
                                                            ) : (
                                                                <FaClock className="h-3 w-3" />
                                                            )}
                                                            {formatStatus(opportunity.status)}
                                                        </span>
                                                        {/* Show approval status as a small indicator */}
                                                        {opportunity.approval_status && (
                                                            <div className="flex items-center gap-1">
                                                                <div className={`w-2 h-2 rounded-full ${opportunity.approval_status?.toLowerCase() === 'approved' ? 'bg-green-500' :
                                                                    opportunity.approval_status?.toLowerCase() === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                                                    }`}></div>
                                                                <span className="text-xs text-gray-500">
                                                                    {formatApprovalStatus(opportunity.approval_status)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full border shadow-sm ${getApprovalStatusColor(opportunity.approval_status)}`}>
                                                            {opportunity.approval_status?.toLowerCase() === 'approved' ? (
                                                                <FaCheckCircle className="h-3 w-3" />
                                                            ) : opportunity.approval_status?.toLowerCase() === 'pending' ? (
                                                                <FaClock className="h-3 w-3" />
                                                            ) : (
                                                                <FaTimes className="h-3 w-3" />
                                                            )}
                                                            {formatApprovalStatus(opportunity.approval_status)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => navigate(`/internships/${opportunity.id}`)}
                                                            className="text-[#00A55F] hover:text-[#008c4f] transition-colors"
                                                            title={t('recruiterDashboard.actions.view')}
                                                        >
                                                            <FaEye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/recruiter/edit-opportunity/${opportunity.id}`)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                                            title={t('recruiterDashboard.actions.edit')}
                                                        >
                                                            <FaEdit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/recruiter/opportunity/${opportunity.id}/applicants`)}
                                                            className="text-purple-600 hover:text-purple-800 transition-colors"
                                                            title={t('recruiterDashboard.actions.viewApplicants')}
                                                        >
                                                            <FaUsers className="h-4 w-4" />
                                                        </button>
                                                        {/* Show rejection reason button for rejected opportunities */}
                                                        {opportunity.approval_status?.toLowerCase() === 'rejected' && (
                                                            <button
                                                                onClick={() => handleViewRejectionReason(opportunity)}
                                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                                title={t('recruiter.viewRejectionReason')}
                                                            >
                                                                <FaExclamationTriangle className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => { setSelectedOpportunity(opportunity); setShowDeleteModal(true); }}
                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                            title={t('recruiterDashboard.actions.delete')}
                                                            disabled={deleteLoading && deletingId === opportunity.id}
                                                        >
                                                            <FaTrash className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center">
                                                <div className="text-gray-500">
                                                    <FaBriefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                    <p className="text-lg font-medium">{t('recruiterDashboard.noOpportunities')}</p>
                                                    <p className="text-sm">{t('recruiterDashboard.createFirst')}</p>
                                                    <button
                                                        onClick={() => navigate('/recruiter/post-opportunity')}
                                                        className="mt-4 px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors"
                                                    >
                                                        {t('recruiterDashboard.createFirst')}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Applications Overview - Full Width Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">{t('recruiter.applicationsOverview')}</h3>
                            <button
                                onClick={() => navigate('/recruiter/applicants')}
                                className="px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors font-medium text-sm"
                            >
                                {t('recruiter.viewAllApplicants')}
                            </button>
                        </div>
                        {/* New: Filtered Applicants Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center justify-center">
                                <div className="text-blue-700 text-lg font-semibold mb-1">{t('recruiter.shortlisted')}</div>
                                <div className="text-3xl font-bold text-blue-900 mb-2">{shortlistedCount}</div>
                                <button
                                    onClick={() => navigate('/recruiter/applicants?shortlisted=true')}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                                >
                                    {t('recruiter.viewAll')}
                                </button>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center justify-center">
                                <div className="text-red-700 text-lg font-semibold mb-1">{t('recruiter.rejected')}</div>
                                <div className="text-3xl font-bold text-red-900 mb-2">{rejectedCount}</div>
                                <button
                                    onClick={() => navigate('/recruiter/applicants?status=rejected')}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                                >
                                    {t('recruiter.viewAll')}
                                </button>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex flex-col items-center justify-center">
                                <div className="text-yellow-700 text-lg font-semibold mb-1">{t('recruiter.pending')}</div>
                                <div className="text-3xl font-bold text-yellow-900 mb-2">{pendingCount}</div>
                                <button
                                    onClick={() => navigate('/recruiter/applicants?status=pending&shortlisted=false')}
                                    className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs font-medium"
                                >
                                    {t('recruiter.viewAll')}
                                </button>
                            </div>
                        </div>
                        {/* Statistics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700 mb-1">{t('recruiter.totalApplicants')}</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {recentOpportunities.reduce((sum, opp) => sum + (opp.applicants_count || 0), 0)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-200 rounded-lg">
                                        <FaUsers className="h-6 w-6 text-blue-700" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-700 mb-1">{t('recruiter.activeOpportunities')}</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {recentOpportunities.filter(opp => opp.status?.toLowerCase() === 'open').length}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-200 rounded-lg">
                                        <FaCheckCircle className="h-6 w-6 text-green-700" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-700 mb-1">{t('recruiter.closedOpportunities')}</p>
                                        <p className="text-2xl font-bold text-red-900">
                                            {recentOpportunities.filter(opp => opp.status?.toLowerCase() === 'closed').length}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-red-200 rounded-lg">
                                        <FaTimes className="h-6 w-6 text-red-700" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-700 mb-1">{t('recruiter.averageApplicants')}</p>
                                        <p className="text-2xl font-bold text-yellow-900">
                                            {Math.round(recentOpportunities.reduce((sum, opp) => sum + (opp.applicants_count || 0), 0) / Math.max(recentOpportunities.length, 1))}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-yellow-200 rounded-lg">
                                        <FaChartBar className="h-6 w-6 text-yellow-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Post New Opportunity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <div className="text-center">
                                <div className="p-3 bg-[#00A55F]/10 rounded-lg inline-block mb-4">
                                    <FaBriefcase className="h-8 w-8 text-[#00A55F]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('recruiter.postJob')}</h3>
                                <p className="text-sm text-gray-600 mb-4">{t('forms.createNewJobOrInternship')}</p>
                                <button
                                    onClick={() => navigate('/recruiter/post-opportunity')}
                                    className="w-full bg-[#00A55F] text-white px-4 py-2 rounded-lg hover:bg-[#008c4f] transition-colors font-medium"
                                >
                                    {t('forms.postNow')}
                                </button>
                            </div>
                        </motion.div>

                        {/* Manage Account */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('forms.manageAccount')}</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/recruiter/profile')}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FaUser className="h-4 w-4 text-gray-500" />
                                    <span>{t('forms.viewProfile')}</span>
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await api.get('/recruiters/me/');
                                            const recruiterData = response.data.data || response.data;
                                            if (recruiterData?.organization) {
                                                navigate(`/recruiter/organization/${recruiterData.organization}/update`);
                                            } else {
                                                toast.error(t('common.error'));
                                            }
                                        } catch (error) {
                                            console.error('Error fetching recruiter data:', error);
                                            navigate('/recruiter/organization/edit');
                                        }
                                    }}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FaBuilding className="h-4 w-4 text-gray-500" />
                                    <span className=" flex items-center gap-1">
                                        {!recruiterData
                                            ? <span className="text-gray-400 animate-pulse">{t('common.loading')}</span>
                                            : <>
                                                {recruiterData?.organization?.name}
                                                {recruiterData?.organization?.is_verified && <VerifiedBadge />}
                                            </>
                                        }
                                        {t('forms.editOrganization')}
                                    </span>
                                </button>
                                <button
                                    onClick={() => navigate('/recruiter/change-password')}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FaLock className="h-4 w-4 text-gray-500" />
                                    <span>{t('forms.changePassword')}</span>
                                </button>
                                <button
                                    onClick={() => navigate('/recruiter/billing')}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FaCreditCard className="h-4 w-4 text-gray-500" />
                                    <span>{t('recruiter.billing')}</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FaSignOutAlt className="h-4 w-4" />
                                    <span>{t('auth.logout')}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedOpportunity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
                        <FaTrash className="mx-auto text-red-500 mb-4" size={32} />
                        <h3 className="text-lg font-bold mb-2">{t('forms.deleteOpportunity')}?</h3>
                        <p className="text-gray-600 mb-4">{t('forms.deleteConfirmation', { title: selectedOpportunity.title })}</p>
                        {deleteError && <p className="text-red-500 mb-2">{deleteError}</p>}
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                                disabled={deleteLoading}
                            >
                                {t('forms.cancel')}
                            </button>
                            <button
                                onClick={handleDeleteOpportunity}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? t('forms.deleting') : t('forms.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Reason Modal */}
            <RejectionReasonModal
                isOpen={showRejectionModal}
                onClose={() => {
                    setShowRejectionModal(false);
                    setSelectedRejectedOpportunity(null);
                }}
                opportunity={selectedRejectedOpportunity}
                rejectionReason={selectedRejectedOpportunity?.rejection_reason || selectedRejectedOpportunity?.admin_notes}
            />
        </div>
    );
};

export default RecruiterDashboard; 