import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaClock, FaCheckCircle, FaTimesCircle, FaEye, FaFilePdf, FaComments } from 'react-icons/fa';
import api from '../../../services/api';
import ResumeModal from '../components/ResumeModal';
import AnswersModal from '../components/AnswersModal';


// Professional, branded applicants page for Stage222 recruiters
// Fetches applicants from backend and displays in a modern, responsive table

const API_URL = '/applications/recruiter/';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const getFilterLabel = (status, shortlisted) => {
    if (shortlisted === 'true') return 'Shortlisted Applicants';
    if (status === 'rejected') return 'Rejected Applicants';
    if (status === 'pending') return 'Pending Applicants';
    if (status === 'accepted') return 'Accepted Applicants';
    return 'All Applicants';
};

const RecruiterApplicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [resumeModal, setResumeModal] = useState({ isOpen: false, resumeUrl: '', candidateName: '' });
    const [answersModal, setAnswersModal] = useState({ isOpen: false, candidate: null, answers: null });

    const navigate = useNavigate();
    const query = useQuery();
    const status = query.get('status');
    const shortlisted = query.get('shortlisted');

    useEffect(() => {
        setLoading(true);
        setError('');
        let url = '/applications/recruiter/';
        const params = [];
        if (status) params.push(`status=${status}`);
        if (shortlisted) params.push(`shortlisted=${shortlisted}`);
        if (params.length) url += '?' + params.join('&');
        api.get(url)
            .then(res => {
                const data = res.data;
                setApplicants(data.results || data.applications || []);
                setLoading(false);
            })
            .catch(err => {
                setError('Could not load applicants.');
                setLoading(false);
            });
    }, [status, shortlisted]);

    // Handle resume modal open
    const openResumeModal = (resumeUrl, candidateName) => {
        setResumeModal({ isOpen: true, resumeUrl, candidateName });
    };

    // Handle resume modal close
    const closeResumeModal = () => {
        setResumeModal({ isOpen: false, resumeUrl: '', candidateName: '' });
    };

    // Handle answers modal open
    const openAnswersModal = (candidate, answers) => {
        setAnswersModal({ isOpen: true, candidate, answers });
    };

    // Handle answers modal close
    const closeAnswersModal = () => {
        setAnswersModal({ isOpen: false, candidate: null, answers: null });
    };



    return (
        <div className="max-w-7xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
            {/* Back to Dashboard */}
            <button
                onClick={() => navigate('/recruiter/dashboard')}
                className="flex items-center text-[#00A55F] hover:text-[#008c4f] mb-6 font-medium"
            >
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Applicants</h1>
            <div className="mb-6 text-sm text-gray-600 font-medium">{getFilterLabel(status, shortlisted)}</div>

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
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Candidate</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied At</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Resume</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Answers</th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {applicants.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-gray-400">No applicants found.</td>
                                </tr>
                            ) : (
                                applicants.map((app, idx) => {
                                    const candidateName = app.candidate?.full_name || app.candidate?.name || app.candidate_name || 'N/A';
                                    const candidateEmail = app.candidate?.email || app.candidate_email || 'N/A';
                                    const candidatePhoto = app.candidate?.photo || app.candidate_photo;
                                    const resumeUrl = app.candidate?.resume || app.candidate_resume;
                                    const candidateId = app.candidate?.id || app.candidate_id;
                                    const internship = app.internship || app.opportunity;

                                    return (
                                        <tr key={idx} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {/* Profile Picture */}
                                                    {candidatePhoto ? (
                                                        <img
                                                            src={candidatePhoto}
                                                            alt={candidateName}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div
                                                        className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#00A55F] to-[#008c4f] flex items-center justify-center text-white font-bold ${candidatePhoto ? 'hidden' : 'flex'}`}
                                                    >
                                                        <FaUser className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{candidateName}</div>
                                                        <div className="text-sm text-gray-500">{candidateEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                                                <span className="flex items-center gap-1">
                                                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                                                    {candidateEmail}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-600 text-sm">
                                                {app.created_at ? new Date(app.created_at).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {resumeUrl ? (
                                                    <button
                                                        onClick={() => openResumeModal(resumeUrl, candidateName)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors duration-200 text-sm"
                                                    >
                                                        <FaEye className="h-4 w-4" />
                                                        View Resume
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No resume</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {((app.screening_answers && Object.keys(app.screening_answers).length > 0) || (app.answers && Object.keys(app.answers).length > 0)) ? (
                                                    <button
                                                        onClick={() => openAnswersModal(
                                                            {
                                                                name: candidateName,
                                                                email: candidateEmail,
                                                                photo: candidatePhoto
                                                            },
                                                            {
                                                                screeningAnswers: app.screening_answers,
                                                                answers: app.answers
                                                            }
                                                        )}
                                                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm"
                                                    >
                                                        <FaComments className="h-4 w-4" />
                                                        View Answers
                                                        <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                                            {(app.screening_answers ? Object.keys(app.screening_answers).length : 0) +
                                                                (app.answers ? Object.keys(app.answers).length : 0)}
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No answers</span>
                                                )}
                                            </td>

                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Resume Modal */}
            <ResumeModal
                isOpen={resumeModal.isOpen}
                onClose={closeResumeModal}
                resumeUrl={resumeModal.resumeUrl}
                candidateName={resumeModal.candidateName}
            />

            {/* Answers Modal */}
            <AnswersModal
                isOpen={answersModal.isOpen}
                onClose={closeAnswersModal}
                candidate={answersModal.candidate}
                answers={answersModal.answers}
            />


        </div>
    );
};

export default RecruiterApplicants; 