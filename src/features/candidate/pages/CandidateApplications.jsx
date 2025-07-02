// CandidateApplications.jsx
// World-class, professional applications page for Stage222
// Inspired by Internshala, tailored for Mauritanian students and Stage222 branding
// Table: Company | Profile | Applied On | Number of Applicants | Application Status | Review Application
// Uses Mauritanian mock data for now; ready for API integration
// RESPONSIVE: Horizontal scroll on mobile, responsive text sizing

import React from 'react';
import { FaUserTie, FaFileAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCertificate, FaChevronRight, FaRegStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Mauritanian mock data for applications
const mockApplications = [
    {
        id: 1,
        company: 'MauriTech',
        logo: null,
        profile: 'Full Stack & Data Engineering Internship',
        appliedOn: '2024-06-01',
        applicants: 128,
        status: 'Hired',
        certificate: true,
    },
    {
        id: 2,
        company: 'Nouakchott Digital',
        logo: null,
        profile: 'Business Analytics Internship',
        appliedOn: '2024-05-20',
        applicants: 87,
        status: 'In Review',
        certificate: false,
    },
    {
        id: 3,
        company: 'Chinguetti Bank',
        logo: null,
        profile: 'Finance & Accounting Internship',
        appliedOn: '2024-05-10',
        applicants: 54,
        status: 'Rejected',
        certificate: false,
    },
    {
        id: 4,
        company: 'Sahara Solutions',
        logo: null,
        profile: 'Community Management Internship',
        appliedOn: '2024-04-28',
        applicants: 102,
        status: 'In Review',
        certificate: false,
    },
];

const statusColors = {
    'Hired': 'bg-green-100 text-green-800',
    'In Review': 'bg-yellow-100 text-yellow-800',
    'Rejected': 'bg-red-100 text-red-800',
};

const CandidateApplications = () => {
    return (
        <div className="max-w-7xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
            {/* Header - Responsive layout */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Applications</h1>
                    <p className="text-gray-500 text-sm">Track your internship and job applications in Mauritania.</p>
                </div>
                <button className="text-[#00A55F] hover:text-[#008c4f] text-sm font-medium flex items-center gap-1">
                    View old applications <FaChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* Applications Table - Horizontal scroll on mobile */}
            <div className="bg-white border rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Profile</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied On</th>
                                <th className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicants</th>
                                <th className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {mockApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-gray-400">
                                        <FaFileAlt className="mx-auto mb-2 text-4xl" />
                                        <div>No applications found</div>
                                    </td>
                                </tr>
                            ) : (
                                mockApplications.map(app => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-gradient-to-br from-[#00A55F] to-[#008c4f] text-white">
                                                {app.logo ? <img src={app.logo} alt={app.company} className="w-10 h-10 rounded-full object-cover" /> : app.company[0]}
                                            </div>
                                            <span className="font-medium text-gray-900 truncate">{app.company}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-700">
                                            <div className="max-w-xs truncate">{app.profile}</div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                                            {new Date(app.appliedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-gray-700">{app.applicants}</td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                                                {app.status === 'Hired' && <FaCheckCircle className="mr-1 h-4 w-4" />}
                                                {app.status === 'Rejected' && <FaTimesCircle className="mr-1 h-4 w-4" />}
                                                {app.status === 'In Review' && <FaHourglassHalf className="mr-1 h-4 w-4" />}
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                                <button className="text-[#00A55F] hover:text-[#008c4f] text-xs font-medium">Review Application</button>
                                                {app.status === 'Hired' && app.certificate && (
                                                    <button className="inline-flex items-center text-xs text-blue-700 hover:underline font-medium">
                                                        <FaCertificate className="mr-1 h-4 w-4" /> View certificate
                                                    </button>
                                                )}
                                                <button className="inline-flex items-center text-xs text-yellow-700 hover:underline font-medium">
                                                    <FaRegStar className="mr-1 h-4 w-4" /> Ace this internship
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CandidateApplications; 