// CandidateApplications.jsx
// World-class, professional applications page for Stage222
// Inspired by Internshala, tailored for Mauritanian students and Stage222 branding
// Table: Company | Profile | Applied On | Number of Applicants | Application Status | Review Application
// Uses Mauritanian mock data for now; ready for API integration
// RESPONSIVE: Horizontal scroll on mobile, responsive text sizing

import React, { useEffect, useState } from 'react';
import { FaUserTie, FaFileAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCertificate, FaChevronRight, FaRegStar, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import messagingApi from '../../../services/messagingApi';
import toast from 'react-hot-toast';

const statusColors = {
    'accepted': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'rejected': 'bg-red-100 text-red-800',
};

const ApplicationModal = ({ isOpen, onClose, application }) => {
    if (!isOpen || !application) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 40 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 40 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00A55F] to-[#008c4f] flex items-center justify-center text-white font-bold text-2xl">
                            {application.candidate_photo ? (
                                <img src={application.candidate_photo.startsWith('http') ? application.candidate_photo : `${import.meta.env.VITE_MEDIA_BASE_URL}${application.candidate_photo}`} alt={application.candidate_name} className="w-14 h-14 rounded-full object-cover" />
                            ) : (
                                application.candidate_name?.[0] || 'C'
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{application.candidate_name}</h2>
                            <p className="text-gray-600 text-sm">{application.candidate_email}</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[application.status] || 'bg-gray-100 text-gray-700'}`}>{application.status}</span>
                        <span className="ml-3 text-xs text-gray-500">Applied on {new Date(application.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                    </div>
                    {/* Opportunity Button */}
                    {application.opportunity && (
                        <div className="mb-4 flex flex-col gap-2">
                            <button
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white font-semibold shadow hover:from-[#008c4f] hover:to-[#00A55F] transition"
                                onClick={() => window.open(`/internships/${application.opportunity.id}`, '_blank')}
                            >
                                View Opportunity (General)
                                <FaChevronRight className="h-4 w-4" />
                            </button>
                            <button
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#008c4f] to-[#00A55F] text-white font-semibold shadow hover:from-[#00A55F] hover:to-[#008c4f] transition border border-[#00A55F]"
                                onClick={() => window.open(`/candidate/internships/${application.opportunity.id}`, '_blank')}
                            >
                                <FaUserTie className="h-4 w-4" />
                                Show Opportunity
                            </button>
                        </div>
                    )}
                    {/* Screening Answers */}
                    {application.screening_answers && Object.keys(application.screening_answers).length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Screening Answers</h3>
                            <div className="space-y-2">
                                {Object.entries(application.screening_answers).map(([question, answer], idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">{question}</div>
                                        <div className="text-gray-700 text-sm">{answer || <span className="text-gray-400">No answer</span>}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Resume */}
                    {application.candidate_resume && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Resume</h3>
                            <a
                                href={application.candidate_resume.startsWith('http') ? application.candidate_resume : `${import.meta.env.VITE_MEDIA_BASE_URL}${application.candidate_resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[#00A55F] hover:text-[#008c4f] text-sm font-medium underline"
                            >
                                <FaFileAlt className="h-4 w-4" /> View Resume
                            </a>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const CandidateApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [messagingModal, setMessagingModal] = useState({ isOpen: false, recruiter: null, internship: null });

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const response = await api.get('/applications/candidate/');
                setApplications(response.data);
            } catch (err) {
                setError('Failed to load applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const openModal = (app) => {
        setSelectedApp(app);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setSelectedApp(null);
    };

    // Handle messaging modal
    const openMessagingModal = (recruiter, internship) => {
        setMessagingModal({ isOpen: true, recruiter, internship });
    };

    const closeMessagingModal = () => {
        setMessagingModal({ isOpen: false, recruiter: null, internship: null });
    };

    // Send message to recruiter
    const sendMessageToRecruiter = async (message, recruiterId, internshipId) => {
        try {
            const messageData = {
                receiver: recruiterId,
                internship: internshipId,
                body: message
            };
            await messagingApi.sendMessage(messageData);
            toast.success('Message sent successfully!');
            closeMessagingModal();
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <ApplicationModal isOpen={modalOpen} onClose={closeModal} application={selectedApp} />

            {/* Messaging Modal */}
            {messagingModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
                        <button
                            onClick={closeMessagingModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00A55F] to-[#008c4f] flex items-center justify-center text-white font-bold text-2xl">
                                <FaPaperPlane className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Message Recruiter</h2>
                                <p className="text-gray-600 text-sm">{messagingModal.recruiter?.name || 'Recruiter'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-transparent resize-none"
                                    placeholder="Type your message here..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={closeMessagingModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const message = document.getElementById('message').value;
                                        if (message.trim()) {
                                            sendMessageToRecruiter(message, messagingModal.recruiter?.id, messagingModal.internship?.id);
                                        } else {
                                            toast.error('Please enter a message');
                                        }
                                    }}
                                    className="px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors flex items-center gap-2"
                                >
                                    <FaPaperPlane className="h-4 w-4" />
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
                <div className="bg-white border rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Candidate</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Opportunity</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Organization</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applied On</th>
                                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                <AnimatePresence>
                                    {applications.map((app, idx) => (
                                        <motion.tr
                                            key={app.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 80, damping: 18 }}
                                            className={`transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#f3fdf7] group`}
                                            whileHover={{ scale: 1.01, boxShadow: '0 4px 24px 0 rgba(0, 165, 95, 0.08)' }}
                                        >
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                                <motion.div
                                                    whileHover={{ scale: 1.08 }}
                                                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-gradient-to-br from-[#00A55F] to-[#008c4f] text-white shadow-md group-hover:scale-105 transition-transform"
                                                >
                                                    {app.candidate_photo ? (
                                                        <img src={app.candidate_photo.startsWith('http') ? app.candidate_photo : `${import.meta.env.VITE_MEDIA_BASE_URL}${app.candidate_photo}`} alt={app.candidate_name} className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        app.candidate_name?.[0] || 'C'
                                                    )}
                                                </motion.div>
                                                <span className="font-semibold text-gray-900 truncate" title={app.candidate_name}>{app.candidate_name}</span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-700">
                                                <div className="max-w-xs truncate" title={app.candidate_email}>{app.candidate_email}</div>
                                            </td>
                                            {/* Opportunity Name */}
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <motion.span
                                                    whileHover={{ scale: 1.05 }}
                                                    className="inline-block max-w-[160px] font-semibold text-[#00A55F] bg-[#e6f9f0] rounded-lg px-3 py-1 truncate shadow-sm"
                                                    title={app.internship_title}
                                                >
                                                    {app.internship_title || 'N/A'}
                                                </motion.span>
                                            </td>
                                            {/* Organization Name */}
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <motion.span
                                                    whileHover={{ scale: 1.05 }}
                                                    className="inline-block max-w-[140px] font-medium text-[#008c4f] bg-[#f0fdf6] rounded-lg px-3 py-1 truncate shadow-sm"
                                                    title={app.organization_name}
                                                >
                                                    {app.organization_name || 'N/A'}
                                                </motion.span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                                                {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                                                <motion.span
                                                    whileHover={{ scale: 1.08 }}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}
                                                >
                                                    {app.status === 'accepted' && <FaCheckCircle className="mr-1 h-4 w-4 text-green-500" />}
                                                    {app.status === 'rejected' && <FaTimesCircle className="mr-1 h-4 w-4 text-red-500" />}
                                                    {app.status === 'pending' && <FaHourglassHalf className="mr-1 h-4 w-4 text-yellow-500" />}
                                                    {app.status}
                                                </motion.span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-[#00A55F] hover:text-[#008c4f] text-xs font-bold underline"
                                                        onClick={() => openModal(app)}
                                                    >
                                                        Review Application
                                                    </motion.button>
                                                    {app.status === 'accepted' && app.certificate && (
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            className="inline-flex items-center text-xs text-blue-700 hover:underline font-bold"
                                                        >
                                                            <FaCertificate className="mr-1 h-4 w-4" /> View certificate
                                                        </motion.button>
                                                    )}
                                                    {/* Show Opportunity Button */}
                                                    {app.internship_id && (
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-[#008c4f] to-[#00A55F] text-white text-xs font-bold shadow-md hover:from-[#00A55F] hover:to-[#008c4f] transition border border-[#00A55F]"
                                                            onClick={() => window.open(`/candidate/internships/${app.internship_id}`, '_blank')}
                                                        >
                                                            <FaUserTie className="h-4 w-4" />
                                                            Show Opportunity
                                                        </motion.button>
                                                    )}
                                                    {/* Message Recruiter Button */}
                                                    {app.recruiter_id && (
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold shadow-md hover:bg-purple-100 transition border border-purple-200"
                                                            onClick={() => openMessagingModal(
                                                                {
                                                                    id: app.recruiter_id,
                                                                    name: app.recruiter_name || app.organization_name || 'Recruiter'
                                                                },
                                                                {
                                                                    id: app.internship_id,
                                                                    title: app.internship_title
                                                                }
                                                            )}
                                                        >
                                                            <FaPaperPlane className="h-4 w-4" />
                                                            Message
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateApplications; 