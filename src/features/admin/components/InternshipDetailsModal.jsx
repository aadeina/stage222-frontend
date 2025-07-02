import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaTimes, FaBuilding, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaGraduationCap, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaListUl, FaQuestionCircle, FaGift, FaBriefcase, FaGlobe, FaUsers } from 'react-icons/fa';
import { getInternshipDetail } from '../../../services/internshipApi';
import toast from 'react-hot-toast';

const InternshipDetailsModal = ({ isOpen, onClose, internship, onApprove, onReject, loading }) => {
    const [fullInternshipData, setFullInternshipData] = useState(null);
    const [fetchingDetails, setFetchingDetails] = useState(false);

    useEffect(() => {
        if (isOpen && internship?.id) {
            fetchFullDetails();
        }
    }, [isOpen, internship?.id]);

    const fetchFullDetails = async () => {
        setFetchingDetails(true);
        try {
            const response = await getInternshipDetail(internship.id);
            console.log('Fetched internship data:', response.data); // Debug log
            setFullInternshipData(response.data);
        } catch (error) {
            console.error('Error fetching internship details:', error);
            toast.error('Failed to fetch complete internship details');
            setFullInternshipData(internship); // Fallback to basic data
        } finally {
            setFetchingDetails(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Not specified';
        if (typeof salary === 'string') return salary;
        return `$${salary.toLocaleString()}`;
    };

    const formatDuration = (duration) => {
        if (!duration) return 'Not specified';
        if (typeof duration === 'string') return duration;
        return `${duration} months`;
    };

    // Helper function to safely render field values that might be objects
    const safeRenderField = (value, fallback = 'Not specified') => {
        if (!value) return fallback;
        if (typeof value === 'object') {
            // Handle organization object
            if (value.name) return value.name;
            // Handle other object types
            if (value.title) return value.title;
            if (value.label) return value.label;
            // If it's an array, join it
            if (Array.isArray(value)) return value.join(', ');
            // If none of the above, stringify it
            return JSON.stringify(value);
        }
        return value;
    };

    if (!isOpen || !internship) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#00A55F] to-emerald-600 px-4 sm:px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <FaInfoCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-white">Internship Details</h2>
                                        <p className="text-emerald-100 text-xs sm:text-sm">Review before approval or rejection</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <FaTimes className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                            {fetchingDetails ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center py-12"
                                >
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A55F] mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading complete internship details...</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="space-y-6"
                                >
                                    {/* Basic Information */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 border border-gray-200"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <FaInfoCircle className="h-5 w-5 text-[#00A55F]" />
                                            Basic Information
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Title</label>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">{safeRenderField(fullInternshipData?.title || internship.title)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Opportunity Type</label>
                                                <p className="text-gray-900 mt-1 capitalize">{safeRenderField(fullInternshipData?.opportunity_type || internship.opportunity_type, 'Internship')}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Status</label>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full border shadow-sm mt-1 ${internship.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                    internship.approval_status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        'bg-red-100 text-red-800 border-red-200'
                                                    }`}>
                                                    {internship.approval_status === 'pending' ? (
                                                        <FaClock className="h-3 w-3" />
                                                    ) : internship.approval_status === 'approved' ? (
                                                        <FaCheckCircle className="h-3 w-3" />
                                                    ) : (
                                                        <FaTimesCircle className="h-3 w-3" />
                                                    )}
                                                    {internship.approval_status === 'pending' ? 'Pending Review' :
                                                        internship.approval_status === 'approved' ? 'Approved' : 'Rejected'}
                                                </span>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Submitted</label>
                                                <p className="text-gray-900 mt-1">{formatDate(internship.submitted_on || internship.created_at)}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Organization & Recruiter */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <FaBuilding className="h-5 w-5 text-blue-600" />
                                            Organization & Recruiter
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Organization</label>
                                                <p className="text-gray-900 mt-1">
                                                    {safeRenderField(fullInternshipData?.organization || internship.organization, 'Not specified')}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Recruiter Email</label>
                                                <p className="text-gray-900 mt-1">{fullInternshipData?.recruiter_email || internship.recruiter_email || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Location & Job Details */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border border-green-200"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <FaMapMarkerAlt className="h-5 w-5 text-green-600" />
                                            Location & Job Details
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Location</label>
                                                <p className="text-gray-900 mt-1">{safeRenderField(fullInternshipData?.location || internship.location, 'Remote/Not specified')}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Work Type</label>
                                                <p className="text-gray-900 mt-1 capitalize">{safeRenderField(fullInternshipData?.type, 'Not specified')}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Job Type</label>
                                                <p className="text-gray-900 mt-1 capitalize">{safeRenderField(fullInternshipData?.job_type, 'Not specified')}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Openings</label>
                                                <p className="text-gray-900 mt-1">{fullInternshipData?.openings || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Duration</label>
                                                <p className="text-gray-900 mt-1">{fullInternshipData?.duration || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Duration (weeks)</label>
                                                <p className="text-gray-900 mt-1">{fullInternshipData?.duration_weeks || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Start Date</label>
                                                <p className="text-gray-900 mt-1">{fullInternshipData?.start_date ? formatDate(fullInternshipData.start_date) : 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Deadline</label>
                                                <p className="text-gray-900 mt-1">{fullInternshipData?.deadline ? formatDate(fullInternshipData.deadline) : 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Compensation */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 sm:p-6 border border-purple-200"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <FaMoneyBillWave className="h-5 w-5 text-purple-600" />
                                            Compensation
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Stipend Type</label>
                                                <p className="text-gray-900 mt-1 capitalize">{safeRenderField(fullInternshipData?.stipend_type)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Stipend Amount</label>
                                                <p className="text-gray-900 mt-1">
                                                    {fullInternshipData?.stipend ?
                                                        `MRU ${parseFloat(fullInternshipData.stipend).toLocaleString()}` :
                                                        'Not specified'
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Stipend Negotiable</label>
                                                <p className="text-gray-900 mt-1">{fullInternshipData?.negotiable ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Description */}
                                    {fullInternshipData?.description && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FaGraduationCap className="h-5 w-5 text-orange-600" />
                                                Description
                                            </h3>
                                            <div className="prose prose-sm max-w-none">
                                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                                    {fullInternshipData.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Responsibilities */}
                                    {fullInternshipData?.responsibilities && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                            className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FaListUl className="h-5 w-5 text-indigo-600" />
                                                Responsibilities
                                            </h3>
                                            <div className="prose prose-sm max-w-none">
                                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                                    {fullInternshipData.responsibilities}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Preferences */}
                                    {fullInternshipData?.preferences && fullInternshipData.preferences.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                            className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FaUsers className="h-5 w-5 text-teal-600" />
                                                Preferences
                                            </h3>
                                            <div className="space-y-2">
                                                {Array.isArray(fullInternshipData.preferences) ? (
                                                    fullInternshipData.preferences.map((preference, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                                                            <p className="text-gray-800">{preference}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                                        {fullInternshipData.preferences}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Screening Questions */}
                                    {fullInternshipData?.screening_questions && fullInternshipData.screening_questions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.9 }}
                                            className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FaQuestionCircle className="h-5 w-5 text-pink-600" />
                                                Screening Questions
                                            </h3>
                                            <div className="space-y-3">
                                                {fullInternshipData.screening_questions.map((question, index) => (
                                                    <div key={index} className="bg-white/50 rounded-lg p-3 border border-pink-200">
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-sm font-medium text-pink-700 bg-pink-100 px-2 py-1 rounded-full">
                                                                Q{index + 1}
                                                            </span>
                                                            <p className="text-gray-800 flex-1">{question}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Perks */}
                                    {fullInternshipData?.perks && fullInternshipData.perks.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.0 }}
                                            className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FaGift className="h-5 w-5 text-yellow-600" />
                                                Perks & Benefits
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {Array.isArray(fullInternshipData.perks) ? (
                                                    fullInternshipData.perks.map((perk, index) => (
                                                        <div key={index} className="flex items-center gap-2 bg-white/50 rounded-lg p-3 border border-yellow-200">
                                                            <FaGift className="h-4 w-4 text-yellow-600" />
                                                            <span className="text-gray-800">{perk}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                                        {fullInternshipData.perks}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                                <button
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Close
                                </button>
                                {internship.approval_status === 'pending' && (
                                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={() => onReject(internship.id, internship.title)}
                                            disabled={loading}
                                            className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <FaTimesCircle className="h-4 w-4" />
                                            {loading ? 'Processing...' : 'Reject'}
                                        </button>
                                        <button
                                            onClick={() => onApprove(internship.id)}
                                            disabled={loading}
                                            className="w-full sm:w-auto px-6 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <FaCheckCircle className="h-4 w-4" />
                                            {loading ? 'Processing...' : 'Approve'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InternshipDetailsModal; 