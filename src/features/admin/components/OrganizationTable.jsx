import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { toggleVerifyOrganization } from '../../../services/adminApi';
import {
    FaCheckCircle,
    FaFolderOpen,
    FaBuilding,
    FaGlobe,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaEye,
    FaExternalLinkAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const OrganizationTable = ({ organizations = [], onActionComplete }) => {
    const [loadingId, setLoadingId] = useState(null);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

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

    // Show organization details modal
    const handleShowDetails = (org) => {
        setSelectedOrg(org);
        setShowDetailsModal(true);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Truncate text
    const truncateText = (text, maxLength = 50) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <>
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Organization</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact Info</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {organizations.map((org) => (
                            <motion.tr
                                key={org.id}
                                className="hover:bg-blue-50 transition-colors"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                                <FaBuilding className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-semibold text-gray-900">{org.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {org.is_independent ? 'Independent' : 'Company'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaEnvelope className="h-3 w-3 text-gray-400" />
                                            <span>{org.email || 'N/A'}</span>
                                        </div>
                                        {org.phone_number && (
                                            <div className="flex items-center gap-2">
                                                <FaPhone className="h-3 w-3 text-gray-400" />
                                                <span className="text-sm text-gray-600">{org.phone_number}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaMapMarkerAlt className="h-3 w-3 text-gray-400" />
                                            <span>{org.address || 'N/A'}</span>
                                        </div>
                                        {org.founded_year && (
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="h-3 w-3 text-gray-400" />
                                                <span className="text-sm text-gray-600">Founded {org.founded_year}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${org.is_verified
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {org.is_verified ? 'Verified' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleShowDetails(org)}
                                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                            title="View Details"
                                        >
                                            <FaEye className="h-4 w-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleVerifyOrg(org.id, org.is_verified)}
                                            disabled={loadingId === org.id}
                                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${org.is_verified
                                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                            title={org.is_verified ? 'Unverify Organization' : 'Verify Organization'}
                                        >
                                            {org.is_verified ? <FaFolderOpen className="h-4 w-4" /> : <FaCheckCircle className="h-4 w-4" />}
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {organizations.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <FaBuilding className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium">No organizations found</p>
                        <p className="text-sm text-gray-400">Organizations will appear here once they register</p>
                    </div>
                )}
            </div>

            {/* Organization Details Modal */}
            {showDetailsModal && selectedOrg && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                        <FaBuilding className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedOrg.name}</h2>
                                        <p className="text-blue-100">
                                            {selectedOrg.is_independent ? 'Independent Organization' : 'Company'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-white hover:text-blue-100 transition-colors"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* About Section */}
                            {selectedOrg.about && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                        {selectedOrg.about}
                                    </p>
                                </div>
                            )}

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <FaEnvelope className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Email</p>
                                            <p className="text-sm text-gray-600">{selectedOrg.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    {selectedOrg.phone_number && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FaPhone className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Phone</p>
                                                <p className="text-sm text-gray-600">{selectedOrg.phone_number}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedOrg.address && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FaMapMarkerAlt className="h-5 w-5 text-red-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Address</p>
                                                <p className="text-sm text-gray-600">{selectedOrg.address}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedOrg.founded_year && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FaCalendarAlt className="h-5 w-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Founded</p>
                                                <p className="text-sm text-gray-600">{selectedOrg.founded_year}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${selectedOrg.is_verified
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {selectedOrg.is_verified ? 'Verified' : 'Pending Verification'}
                                    </span>
                                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {selectedOrg.is_independent ? 'Independent' : 'Company'}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleVerifyOrg(selectedOrg.id, selectedOrg.is_verified)}
                                    disabled={loadingId === selectedOrg.id}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${selectedOrg.is_verified
                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                >
                                    {loadingId === selectedOrg.id ? 'Processing...' :
                                        selectedOrg.is_verified ? 'Unverify Organization' : 'Verify Organization'
                                    }
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowDetailsModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default OrganizationTable; 