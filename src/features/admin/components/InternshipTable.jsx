import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { approveInternship, rejectInternship } from '../../../services/adminApi';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import RejectionModal from './RejectionModal';

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
    const [loadingId, setLoadingId] = useState(null);
    const [rejectionModal, setRejectionModal] = useState({
        isOpen: false,
        internshipId: null,
        internshipTitle: ''
    });

    const handleApprove = async (id) => {
        setLoadingId(id);
        try {
            await approveInternship(id);
            toast.success('Internship approved successfully!');
            onActionComplete && onActionComplete();
        } catch (error) {
            toast.error('Failed to approve internship.');
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
            toast.success('Internship rejected successfully!');
            setRejectionModal({ isOpen: false, internshipId: null, internshipTitle: '' });
            onActionComplete && onActionComplete();
        } catch (error) {
            toast.error('Failed to reject internship.');
        } finally {
            setLoadingId(null);
        }
    };

    const closeRejectionModal = () => {
        setRejectionModal({ isOpen: false, internshipId: null, internshipTitle: '' });
    };

    return (
        <>
            {/* Debug info - remove this later */}
            <div className="mb-4 p-2 bg-yellow-100 text-xs">
                Modal state: {JSON.stringify(rejectionModal)}
                <button
                    onClick={() => {
                        alert('Test button works!');
                        setRejectionModal({
                            isOpen: true,
                            internshipId: 'test-id',
                            internshipTitle: 'Test Internship'
                        });
                    }}
                    className="ml-4 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                >
                    Test Modal
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recruiter</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {internships.map((internship) => {
                            const isPending = internship.approval_status === 'pending';
                            return (
                                <tr key={internship.id} className="hover:bg-blue-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{internship.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{internship.organization}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{internship.recruiter_email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${internship.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            internship.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {internship.approval_status === 'pending' ? 'Pending' :
                                                internship.approval_status === 'approved' ? 'Approved' : 'Rejected'}
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
                                                    Approve
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
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                {internship.approval_status === 'approved' ? 'Approved' : 'Rejected'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {internships.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No pending internships found.</div>
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
        </>
    );
};

export default InternshipTable; 