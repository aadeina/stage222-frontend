import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import api from '../../../services/api';

// Professional, branded applicants page for Stage222 recruiters
// Fetches applicants from backend and displays in a modern, responsive table

const API_URL = '/applications/recruiter/applications/';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const RecruiterApplicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError('');
        api.get(API_URL)
            .then(res => {
                const data = res.data;
                setApplicants(data.results || data.applications || []);
                setLoading(false);
            })
            .catch(err => {
                setError('Could not load applicants.');
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
            {/* Back to Dashboard */}
            <button
                onClick={() => navigate('/recruiter/dashboard')}
                className="flex items-center text-[#00A55F] hover:text-[#008c4f] mb-6 font-medium"
            >
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">All Applicants</h1>

            {/* Loading and Error States */}
            {loading && (
                <div className="text-center text-gray-500 py-12">Loading applicants...</div>
            )}
            {error && (
                <div className="text-center text-red-600 py-12">{error}</div>
            )}

            {/* Applicants Table */}
            {!loading && !error && (
                <div className="bg-white border rounded-xl shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied At</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Answers</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {applicants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-gray-400">No applicants found.</td>
                                </tr>
                            ) : (
                                applicants.map((app, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-4 whitespace-nowrap flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00A55F] to-[#008c4f] flex items-center justify-center text-white font-bold">
                                                <FaUser className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium text-gray-900 truncate">{app.candidate?.full_name || app.candidate?.name || 'N/A'}</span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                                            <span className="flex items-center gap-1"><FaEnvelope className="h-4 w-4 text-gray-400" /> {app.candidate?.email || 'N/A'}</span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {app.status === 'pending' && <FaClock className="mr-1 h-4 w-4" />}
                                                {app.status === 'accepted' && <FaCheckCircle className="mr-1 h-4 w-4" />}
                                                {app.status === 'rejected' && <FaTimesCircle className="mr-1 h-4 w-4" />}
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-gray-600 text-sm">
                                            {app.created_at ? new Date(app.created_at).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-pre-line text-gray-700 text-xs max-w-xs">
                                            {app.answers ? Object.entries(app.answers).map(([q, a], i) => (
                                                <div key={i} className="mb-1"><span className="font-semibold">{q}:</span> {a}</div>
                                            )) : '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecruiterApplicants; 