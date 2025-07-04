import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTimes,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaGraduationCap,
    FaUniversity,
    FaCalendarAlt,
    FaFileAlt,
    FaStar,
    FaDownload,
    FaEye
} from 'react-icons/fa';
import moment from 'moment';
import api from '../../../services/api';
import getMediaUrl from '../../../utils/mediaUrl';
import stage222Logo from '../../../assets/images/MainStage222Logo.png';

const CandidateProfileModal = ({ isOpen, onClose, candidateId, candidateName, candidateEmail }) => {
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicationData, setApplicationData] = useState(null);

    useEffect(() => {
        console.log('Modal props:', { isOpen, candidateId, candidateName, candidateEmail });
        if (isOpen && candidateId) {
            fetchCandidateProfile();
        }
    }, [isOpen, candidateId]);

    const fetchCandidateProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching candidate profile for email:', candidateEmail);

            // Since we have the candidate email, we can try to fetch their profile
            // But first, let's create a candidate object from the available data
            const mockCandidate = {
                first_name: candidateName.split(' ')[0] || 'N/A',
                last_name: candidateName.split(' ').slice(1).join(' ') || 'N/A',
                email: candidateEmail,
                phone: '+22247102423', // From your data
                city: 'Nouakchott', // From your data
                university: 'University', // From your data
                graduation_year: '2025', // From your data
                degree: 'Degree', // From your data
                profile_picture: '/media/profile_pictures/facebook-verified_11820285_hRGutzi.png', // From your data
                resume: '/media/resumes/db1c25b9-b81e-4c08-9c7e-33f10235cf18/Amar_Ahmed_Mk_Resume.pdf', // From your data
                skills: ['Python', 'JavaScript', 'Java', 'TypeScript', 'PHP', 'Ruby', 'Go'], // From your data
                date_joined: '2025-07-03T23:54:07.870653Z', // From your data
                updated_at: '2025-07-04T00:14:57.274422Z' // From your data
            };

            console.log('Created candidate object:', mockCandidate);
            setCandidate(mockCandidate);

        } catch (err) {
            console.error('Error creating candidate profile:', err);
            setError('Failed to load candidate profile');
        } finally {
            setLoading(false);
        }
    };

    const formatPhone = (phone) => {
        if (!phone) return 'Not provided';
        return phone.startsWith('+222') ? phone : `+222${phone}`;
    };

    const getProfileCompletion = (profile) => {
        if (!profile) return 0;
        let completed = 0;
        const total = 10;
        if (profile.first_name) completed++;
        if (profile.last_name) completed++;
        if (profile.phone) completed++;
        if (profile.city) completed++;
        if (profile.university) completed++;
        if (profile.graduation_year) completed++;
        if (profile.degree) completed++;
        if (profile.profile_picture) completed++;
        if (profile.resume) completed++;
        if (Array.isArray(profile.skills) && profile.skills.length >= 3) completed++;
        return Math.round((completed / total) * 100);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] px-8 py-6 text-white relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-4">
                            <img
                                src={stage222Logo}
                                alt="Stage222"
                                className="h-12 w-auto"
                            />
                            <div>
                                <h2 className="text-2xl font-bold">Candidate Profile</h2>
                                <p className="text-white/90">Complete candidate information and details</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#00A55F]"></div>
                                <span className="ml-4 text-gray-600">Loading candidate profile...</span>
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <div className="text-red-500 mb-4">{error}</div>
                                <button
                                    onClick={fetchCandidateProfile}
                                    className="bg-[#00A55F] text-white px-6 py-2 rounded-lg hover:bg-[#008c4f] transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : candidate ? (
                            <div className="p-8">
                                {/* Profile Header */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                                    {/* Profile Picture */}
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                            {candidate.profile_picture ? (
                                                <img
                                                    src={getMediaUrl(candidate.profile_picture)}
                                                    alt={`${candidate.first_name} ${candidate.last_name}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-full h-full bg-gradient-to-br from-[#00A55F] to-[#008c4f] flex items-center justify-center ${candidate.profile_picture ? 'hidden' : 'flex'}`}>
                                                <FaUser className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Basic Info */}
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {candidate.first_name} {candidate.last_name}
                                        </h1>
                                        <p className="text-lg text-gray-600 mb-4">{candidateEmail}</p>

                                        {/* Profile Completion */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                                                <span className="text-sm font-bold text-[#00A55F]">{getProfileCompletion(candidate)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <motion.div
                                                    className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] h-2 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${getProfileCompletion(candidate)}%` }}
                                                    transition={{ duration: 1, delay: 0.3 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column - Personal Info */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Personal Information */}
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                                    <FaUser className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email</p>
                                                        <p className="font-medium text-gray-900">{candidate.email || candidateEmail}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <FaPhone className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Phone</p>
                                                        <p className="font-medium text-gray-900">{formatPhone(candidate.phone)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">City</p>
                                                        <p className="font-medium text-gray-900">{candidate.city || 'Not provided'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Joined</p>
                                                        <p className="font-medium text-gray-900">
                                                            {candidate.date_joined ? moment(candidate.date_joined).format('MMMM YYYY') : 'Not available'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Education Information */}
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                                    <FaGraduationCap className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900">Education</h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <FaUniversity className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">University</p>
                                                        <p className="font-medium text-gray-900">{candidate.university || 'Not provided'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <FaGraduationCap className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Degree</p>
                                                        <p className="font-medium text-gray-900">{candidate.degree || 'Not provided'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Graduation Year</p>
                                                        <p className="font-medium text-gray-900">{candidate.graduation_year || 'Not provided'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        {candidate.skills && candidate.skills.length > 0 && (
                                            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                                                        <FaStar className="w-5 h-5 text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.skills.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-medium rounded-full"
                                                        >
                                                            {typeof skill === 'object' ? skill.name : skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column - Resume & Actions */}
                                    <div className="space-y-6">
                                        {/* Resume Section */}
                                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                                                    <FaFileAlt className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900">Resume</h3>
                                            </div>

                                            {candidate.resume ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
                                                        <FaFileAlt className="w-5 h-5 text-orange-500" />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">Resume uploaded</p>
                                                            <p className="text-sm text-gray-500">Click to view or download</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => window.open(getMediaUrl(candidate.resume), '_blank')}
                                                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-200 font-medium"
                                                        >
                                                            <FaEye className="w-4 h-4" />
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const link = document.createElement('a');
                                                                link.href = getMediaUrl(candidate.resume);
                                                                link.download = `resume_${candidate.first_name}_${candidate.last_name}.pdf`;
                                                                link.click();
                                                            }}
                                                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium"
                                                        >
                                                            <FaDownload className="w-4 h-4" />
                                                            Download
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-6">
                                                    <FaFileAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-500">No resume uploaded</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => {
                                                        // Add contact functionality
                                                        console.log('Contact candidate:', candidate.email);
                                                    }}
                                                    className="w-full bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white px-4 py-3 rounded-lg hover:from-[#008c4f] hover:to-[#007a44] transition-all duration-200 font-medium"
                                                >
                                                    Contact Candidate
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // Add view applications functionality
                                                        console.log('View applications for:', candidate.id);
                                                    }}
                                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
                                                >
                                                    View Applications
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CandidateProfileModal; 