import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import logo from '../../../assets/images/MainStage222Logo.png';
import api from '../../../services/api';

// ApplyModal.jsx
// Professional, branded modal for candidate application flow

const navLinks = [
    { label: 'Home', href: '/candidate/dashboard' },
    { label: 'Internships', href: '/internships' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'Login', href: '/login' },
    { label: 'Register as Student', href: '/register' },
    { label: 'For Employers', href: '/recruiter/login' },
];

const ApplyModal = ({ isOpen, onClose, internship, onSuccess }) => {
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Get screening questions from internship prop
    const questions = internship?.screening_questions || [];

    // Handle input change
    const handleChange = (q, value) => {
        setAnswers(a => ({ ...a, [q]: value }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Validation: all questions must be answered
        const unanswered = (internship?.screening_questions || []).filter(q => !answers[q] || answers[q].trim() === '');
        if (unanswered.length > 0) {
            setError('Please answer all screening questions before submitting.');
            return;
        }
        setLoading(true);
        try {
            console.log('Submitting answers:', answers); // Debug log
            await api.post(`/applications/internships/${internship.id}/apply/`, {
                answers,
                screening_answers: answers,
            });
            setSuccess(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setAnswers({});
            setError('');
            setSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-2 relative flex flex-col max-h-[90vh]">
                {/* Header with logo and nav */}
                <div className="flex items-center justify-between border-b p-4 bg-gradient-to-r from-[#00A55F] to-[#008c4f]">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Stage222 Logo" className="h-8 w-auto" />
                        <span className="text-white font-bold text-lg">Apply to Stage222</span>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>
                {/* Navigation */}
                <nav className="flex flex-wrap gap-2 px-4 py-2 bg-white border-b">
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} className="text-xs sm:text-sm text-gray-700 hover:text-[#00A55F] font-medium transition-colors">
                            {link.label}
                        </a>
                    ))}
                </nav>
                {/* Internship Details */}
                <div className="px-4 py-3 border-b">
                    <div className="font-semibold text-lg text-gray-900 mb-1">{internship?.title}</div>
                    <div className="text-sm text-gray-600 mb-1">{internship?.organization_name || internship?.company_name || internship?.company || ''}</div>
                    <div className="text-xs text-gray-500">{internship?.location} • Apply by {internship?.application_deadline ? new Date(internship.application_deadline).toLocaleDateString() : ''}</div>
                </div>
                {/* Screening Questions & Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                    {error && (
                        <div className="text-red-600 text-center py-4">{error}</div>
                    )}
                    {success ? (
                        <div className="text-center py-8">
                            <div className="text-2xl font-bold text-[#00A55F] mb-2">Application Submitted!</div>
                            <div className="text-gray-700 mb-4">Thank you for applying to <b>{internship?.title}</b> at Stage222.<br />We'll notify you about your application status soon.</div>
                            <button type="button" onClick={onClose} className="mt-2 px-6 py-2 bg-[#00A55F] text-white rounded-lg font-medium hover:bg-[#008c4f]">Close</button>
                        </div>
                    ) : (
                        <>
                            {questions.length > 0 ? (
                                <>
                                    <div className="text-gray-800 font-medium mb-2">Screening Questions</div>
                                    {questions.map((q, idx) => (
                                        <div key={idx} className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                {q}
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <textarea
                                                required
                                                className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-[#00A55F] focus:outline-none resize-none"
                                                rows={2}
                                                value={answers[q] || ''}
                                                onChange={e => handleChange(q, e.target.value)}
                                                placeholder="Your answer..."
                                            />
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="text-gray-500 text-center py-4">No screening questions for this opportunity.</div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 py-2 bg-[#00A55F] text-white rounded-lg font-semibold hover:bg-[#008c4f] transition-colors flex items-center justify-center"
                            >
                                {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                                Submit Application
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ApplyModal; 