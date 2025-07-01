import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { approveInternship, rejectInternship, toggleVerifyOrganization } from '../../../services/adminApi';
import { FaCheckCircle, FaFolderOpen } from 'react-icons/fa';

const InternshipTable = ({ internships = [], onActionComplete }) => {
    const [loadingId, setLoadingId] = useState(null);

    const handleApprove = async (id) => {
        setLoadingId(id);
        try {
            await approveInternship(id);
            toast.success('Internship approved!');
            onActionComplete && onActionComplete();
        } catch {
            toast.error('Failed to approve internship.');
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (id) => {
        setLoadingId(id);
        try {
            await rejectInternship(id);
            toast.success('Internship rejected!');
            onActionComplete && onActionComplete();
        } catch {
            toast.error('Failed to reject internship.');
        } finally {
            setLoadingId(null);
        }
    };

    // Toggle organization verification status
    const handleVerifyOrg = async (orgId, isVerified) => {
        setLoadingId(orgId);
        try {
            await toggleVerifyOrganization(orgId);
            toast.success(isVerified ? 'Organization unverified!' : 'Organization verified!');
            onActionComplete && onActionComplete();
        } catch {
            toast.error('Failed to toggle verification.');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recruiter</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {internships.map((internship) => {
                        // Try to get organization verification status from internship.organization or fallback
                        const orgId = internship.organization_id || internship.org_id || internship.organization?.id;
                        const isVerified = internship.organization?.is_verified ?? internship.organization_is_verified ?? false;
                        return (
                            <tr key={internship.id} className="hover:bg-blue-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{internship.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{internship.recruiter_name || internship.recruiter?.name || internship.recruiter_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{internship.status || 'Pending'}</td>
                                <td className="px-6 py-4 text-center space-x-2">
                                    <button onClick={() => handleApprove(internship.id)} disabled={loadingId === internship.id} className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-semibold disabled:opacity-50">Approve</button>
                                    <button onClick={() => handleReject(internship.id)} disabled={loadingId === internship.id} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-semibold disabled:opacity-50">Reject</button>
                                    {/* Organization Verify/Unverify Button */}
                                    {orgId && (
                                        <button
                                            onClick={() => handleVerifyOrg(orgId, isVerified)}
                                            disabled={loadingId === orgId}
                                            className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition disabled:opacity-50 ${isVerified
                                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                }`}
                                            title={isVerified ? 'Unverify Organization' : 'Verify Organization'}
                                        >
                                            {isVerified ? <FaFolderOpen className="text-base" /> : <FaCheckCircle className="text-base" />}
                                            {isVerified ? 'Unverify' : 'Verify'} Org
                                        </button>
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
    );
};

export default InternshipTable; 