import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaExclamationTriangle, FaInfoCircle, FaCalendarAlt, FaUserTie } from 'react-icons/fa';

const RejectionReasonModal = ({ isOpen, onClose, opportunity, rejectionReason }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    if (!isOpen || !opportunity) return null;

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
                        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <FaExclamationTriangle className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{t('recruiter.rejectionReasonModal.rejectionDetails')}</h2>
                                        <p className="text-red-100 text-sm">{t('recruiter.rejectionReasonModal.opportunityNotApproved')}</p>
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
                        <div className="p-6 space-y-6">
                            {/* Opportunity Info */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#00A55F]/10 rounded-lg">
                                        <FaUserTie className="h-6 w-6 text-[#00A55F]" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {opportunity.title}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                                                <span>{t('recruiter.rejectionReasonModal.posted')} {new Date(opportunity.created_at || opportunity.postedDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaInfoCircle className="h-4 w-4 text-gray-400" />
                                                <span>{t('recruiter.rejectionReasonModal.type')} {opportunity.opportunity_type || opportunity.type || 'Job'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rejection Reason */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">{t('recruiter.rejectionReasonModal.rejectionReason')}</h3>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 leading-relaxed">
                                                {rejectionReason || t('recruiter.rejectionReasonModal.noSpecificReason')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                    <FaInfoCircle className="h-4 w-4" />
                                    {t('recruiter.rejectionReasonModal.nextSteps')}
                                </h4>
                                <ul className="space-y-2 text-sm text-blue-800">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>{t('recruiter.rejectionReasonModal.reviewRejectionReason')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>{t('recruiter.rejectionReasonModal.updateOpportunityDetails')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>{t('recruiter.rejectionReasonModal.resubmitOpportunity')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    {t('recruiter.rejectionReasonModal.close')}
                                </button>
                                <button
                                    onClick={() => {
                                        onClose();
                                        // Navigate to edit opportunity
                                        navigate(`/recruiter/edit-opportunity/${opportunity.id}`);
                                    }}
                                    className="px-6 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors font-medium"
                                >
                                    {t('recruiter.rejectionReasonModal.editOpportunity')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RejectionReasonModal; 