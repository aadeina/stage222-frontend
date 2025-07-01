import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';

const OrganizationsDashboard = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get('/api/organizations/');
                setOrganizations(res.data.results || []);
            } catch (err) {
                setError('Failed to load organizations.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrganizations();
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Organizations</h1>
            {loading && (
                <div className="flex items-center justify-center h-40">
                    <FaSpinner className="animate-spin h-8 w-8 text-[#00A55F]" />
                </div>
            )}
            {error && (
                <div className="text-red-600 font-medium mb-4">{error}</div>
            )}
            {!loading && organizations.length === 0 && !error && (
                <div className="text-gray-500 text-center py-12">No organizations found.</div>
            )}
            {!loading && organizations.length > 0 && (
                <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Industry</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Website</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Independent?</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {organizations.map(org => (
                                <tr
                                    key={org.id}
                                    className="hover:bg-[#F6FFF9] cursor-pointer transition"
                                    onClick={() => navigate(`/admin/organizations/${org.id}`)}
                                    title="View details"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{org.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{org.industry || <span className="text-gray-400">—</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {org.website ? (
                                            <a
                                                href={org.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[#00A55F] hover:underline"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {org.website}
                                                <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {org.is_independent ? (
                                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Yes</span>
                                        ) : (
                                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">No</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrganizationsDashboard; 