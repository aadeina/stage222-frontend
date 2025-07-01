import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { toggleVerifyOrganization } from '../../../services/adminApi';
import { FaCheckCircle, FaFolderOpen } from 'react-icons/fa';

const OrganizationTable = ({ organizations = [], onActionComplete }) => {
    const [loadingId, setLoadingId] = useState(null);

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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {organizations.map((org) => (
                        <tr key={org.id} className="hover:bg-blue-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{org.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{org.email || org.contact_email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{org.is_verified ? 'Verified' : 'Unverified'}</td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    onClick={() => handleVerifyOrg(org.id, org.is_verified)}
                                    disabled={loadingId === org.id}
                                    className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition disabled:opacity-50 ${org.is_verified
                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                    title={org.is_verified ? 'Unverify Organization' : 'Verify Organization'}
                                >
                                    {org.is_verified ? <FaFolderOpen className="text-base" /> : <FaCheckCircle className="text-base" />}
                                    {org.is_verified ? 'Unverify' : 'Verify'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {organizations.length === 0 && (
                <div className="p-8 text-center text-gray-500">No organizations found.</div>
            )}
        </div>
    );
};

export default OrganizationTable; 