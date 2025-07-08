import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { approveInternship, rejectInternship } from '../../../services/adminApi';
import { FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import RejectionModal from './RejectionModal';
import InternshipDetailsModal from './InternshipDetailsModal';

// Format date for display
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const InternshipTable = ({ internships = [], onActionComplete }) => {
    const { t } = useTranslation();
    const [loadingId, setLoadingId] = useState(null);
    const [rejectionModal, setRejectionModal] = useState({
        isOpen: false,
        internshipId: null,
        internshipTitle: ''
    });
    const [detailsModal, setDetailsModal] = useState({
        isOpen: false,
        internship: null
    });

    const handleApprove = async (id) => {
        setLoadingId(id);
        try {
            await approveInternship(id);
            toast.success(t('admin.components.internshipTable.internshipApproved'));
            onActionComplete && onActionComplete();
        } catch (error) {
            toast.error(t('admin.components.internshipTable.failedToApprove'));
        } finally {
            setLoadingId(null);
        }
    };

    const handleRejectClick = (id, title) => {
        console.log('Reject clicked for:', id, title); // Debug log
        setRejectionModal({
            isOpen: true,
            internshipId: id,
            internshipTitle: title
        });
        console.log('Modal state set to open'); // Debug log
    };

    const handleRejectSubmit = async (reason) => {
        setLoadingId(rejectionModal.internshipId);
        try {
            await rejectInternship(rejectionModal.internshipId, reason);
            toast.success(t('admin.components.internshipTable.internshipRejected'));
            setRejectionModal({ isOpen: false, internshipId: null, internshipTitle: '' });
            onActionComplete && onActionComplete();
        } catch (error) {
            toast.error(t('admin.components.internshipTable.failedToReject'));
        } finally {
            setLoadingId(null);
        }
    };

    const closeRejectionModal = () => {
        setRejectionModal({ isOpen: false, internshipId: null, internshipTitle: '' });
    };

    const handleViewDetails = (internship) => {
        setDetailsModal({
            isOpen: true,
            internship: internship
        });
    };

    const closeDetailsModal = () => {
        setDetailsModal({ isOpen: false, internship: null });
    };

    const handleApproveFromModal = async (id) => {
        await handleApprove(id);
        closeDetailsModal();
    };

    const handleRejectFromModal = (id, title) => {
        closeDetailsModal();
        setRejectionModal({
            isOpen: true,
            internshipId: id,
            internshipTitle: title
        });
    };

    return (
        <>

            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.components.internshipTable.title')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.components.internshipTable.organization')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.components.internshipTable.recruiter')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.components.internshipTable.status')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.components.internshipTable.submitted')}</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">{t('admin.components.internshipTable.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {internships.map((internship) => {
                            const isPending = internship.approval_status === 'pending';
                            return (
                                <tr key={internship.id} className="hover:bg-blue-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleViewDetails(internship)}
                                            className="text-left font-medium text-[#00A55F] hover:text-[#008c4f] transition-colors flex items-center gap-2 group"
                                            title={t('admin.components.internshipTable.clickToViewDetails')}
                                        >
                                            <span className="group-hover:underline">{internship.title}</span>
                                            <FaEye className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{internship.organization}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{internship.recruiter_email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${internship.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            internship.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {internship.approval_status === 'pending' ? t('admin.components.internshipTable.pending') :
                                                internship.approval_status === 'approved' ? t('admin.components.internshipTable.approved') : t('admin.components.internshipTable.rejected')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(internship.submitted_on)}</td>
                                    <td className="px-6 py-4 text-center">
                                        {isPending ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleApprove(internship.id)}
                                                    disabled={loadingId === internship.id}
                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    <FaCheckCircle className="mr-1" />
                                                    {t('admin.components.internshipTable.approve')}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        console.log('Reject button clicked!');
                                                        handleRejectClick(internship.id, internship.title);
                                                    }}
                                                    disabled={loadingId === internship.id}
                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    <FaTimesCircle className="mr-1" />
                                                    {t('admin.components.internshipTable.reject')}
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                {internship.approval_status === 'approved' ? t('admin.components.internshipTable.approved') : t('admin.components.internshipTable.rejected')}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {internships.length === 0 && (
                    <div className="p-8 text-center text-gray-500">{t('admin.components.internshipTable.noPendingInternships')}</div>
                )}
            </div>

            {/* Rejection Modal */}
            <RejectionModal
                isOpen={rejectionModal.isOpen}
                onClose={closeRejectionModal}
                onReject={handleRejectSubmit}
                internshipTitle={rejectionModal.internshipTitle}
                loading={loadingId === rejectionModal.internshipId}
            />

            {/* Internship Details Modal */}
            <InternshipDetailsModal
                isOpen={detailsModal.isOpen}
                onClose={closeDetailsModal}
                internship={detailsModal.internship}
                onApprove={handleApproveFromModal}
                onReject={handleRejectFromModal}
                loading={loadingId === detailsModal.internship?.id}
            />
        </>
    );
};

export default InternshipTable; 