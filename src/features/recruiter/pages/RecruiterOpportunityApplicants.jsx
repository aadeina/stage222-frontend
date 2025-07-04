import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaClock, FaCheckCircle, FaTimesCircle, FaEye, FaFilePdf, FaComments } from 'react-icons/fa';
import api from '../../../services/api';
import ResumeModal from '../components/ResumeModal';
import AnswersModal from '../components/AnswersModal';
import CandidateProfileModal from '../components/CandidateProfileModal';

// Professional, branded applicants page for a specific opportunity
// Fetches applicants from backend and displays in a modern, responsive table

const STATUS_CHOICES = [
    { value: 'pending', label: 'Pending' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
];

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const RecruiterOpportunityApplicants = () => {
    const { opportunityId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [resumeModal, setResumeModal] = useState({ isOpen: false, resumeUrl: '', candidateName: '' });
    const [answersModal, setAnswersModal] = useState({ isOpen: false, candidate: null, answers: null });
    const [profileModal, setProfileModal] = useState({ isOpen: false, candidateId: null, candidateName: '', candidateEmail: '' });
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError('');
        api.get(`/applications/internships/${opportunityId}/applicants/`)
            .then(res => {
                const data = res.data;
                setApplicants(data.results || data.applications || []);
                setLoading(false);
            })
            .catch(err => {
                setError('Could not load applicants.');
                setLoading(false);
            });
    }, [opportunityId]);

    const handleStatusChange = async (app, newStatus) => {
        setUpdatingId(app.id);
        setFeedback('');
        try {
            await api.patch(`/applications/${app.id}/update/`, { status: newStatus });
            setApplicants(prev => prev.map(a => a.id === app.id ? { ...a, status: newStatus } : a));
            setFeedback('Status updated successfully!');
            setTimeout(() => setFeedback(''), 2000);
        } catch (err) {
            setFeedback('Failed to update status.');
            setTimeout(() => setFeedback(''), 2000);
        } finally {
            setUpdatingId(null);
        }
    };

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

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Applicants for Opportunity</h1>
            {feedback && <div className="mb-4 text-center text-sm font-medium text-[#00A55F]">{feedback}</div>}

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
                                    const candidateName = app.candidate_name || app.candidate?.full_name || app.candidate?.name || 'N/A';
                                    const candidateEmail = app.candidate_email || app.candidate?.email || 'N/A';
                                    const candidatePhoto = app.candidate?.photo || app.candidate_photo;
                                    const resumeUrl = app.candidate?.resume || app.candidate_resume;
                                    // Since we don't have candidate_id, we'll use the candidate email as identifier
                                    const candidateId = app.candidate_email || app.candidate?.email;

                                    // Debug: Log the application data to see what's available
                                    console.log('Application data:', app);
                                    console.log('Extracted candidateId:', candidateId);

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
                                                        <span
                                                            className="font-bold text-[#00A55F] cursor-pointer hover:underline text-base"
                                                            onClick={() => {
                                                                console.log('Opening profile modal with:', { candidateId, candidateName, candidateEmail });
                                                                setProfileModal({ isOpen: true, candidateId, candidateName, candidateEmail });
                                                            }}
                                                        >
                                                            {candidateName}
                                                        </span>
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
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                                                        {app.status}
                                                    </span>
                                                    <select
                                                        className="ml-2 px-2 py-1 rounded border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00A55F] bg-white text-gray-700"
                                                        value={app.status}
                                                        disabled={updatingId === app.id}
                                                        onChange={e => handleStatusChange(app, e.target.value)}
                                                    >
                                                        {STATUS_CHOICES.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                    {updatingId === app.id && <span className="ml-2 text-xs text-gray-400 animate-pulse">Updating...</span>}
                                                </div>
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

            <CandidateProfileModal
                isOpen={profileModal.isOpen}
                onClose={() => setProfileModal({ ...profileModal, isOpen: false })}
                candidateId={profileModal.candidateId}
                candidateName={profileModal.candidateName}
                candidateEmail={profileModal.candidateEmail}
            />
        </div>
    );
};

export default RecruiterOpportunityApplicants; 