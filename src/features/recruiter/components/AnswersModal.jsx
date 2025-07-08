import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaUser, FaEnvelope, FaCalendar } from 'react-icons/fa';

// AnswersModal.jsx
// Professional modal to display candidate answers for recruiters
// Shows questions and answers in a clean, organized layout

const AnswersModal = ({ isOpen, onClose, candidate, answers }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    const candidateName = candidate?.name || candidate?.full_name || candidate?.candidate_name || 'N/A';
    const candidateEmail = candidate?.email || candidate?.candidate_email || 'N/A';
    const candidatePhoto = candidate?.photo || candidate?.candidate_photo;

    // Extract screening answers and other answers from the answers prop
    const screeningAnswers = answers?.screeningAnswers || {};
    const otherAnswers = answers?.answers || {};

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            {/* Candidate Profile */}
                            <div className="flex items-center gap-3">
                                {candidatePhoto ? (
                                    <img
                                        src={candidatePhoto}
                                        alt={candidateName}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#00A55F] to-[#008c4f] flex items-center justify-center text-white font-bold ${candidatePhoto ? 'hidden' : 'flex'}`}
                                >
                                    <FaUser className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {candidateName}
                                    </h2>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <FaEnvelope className="h-3 w-3" />
                                        {candidateEmail}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <FaTimes className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Screening Answers */}
                            {screeningAnswers && Object.keys(screeningAnswers).length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-[#00A55F] mb-4 flex items-center gap-2">
                                        <FaCalendar className="h-4 w-4" />
                                        {t('recruiter.answersModal.screeningQuestionsAnswers')}
                                    </h3>
                                    <div className="space-y-4">
                                        {Object.entries(screeningAnswers).map(([question, answer], index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="mb-2">
                                                    <h4 className="font-semibold text-gray-800 text-sm">
                                                        {question}
                                                    </h4>
                                                </div>
                                                <div className="bg-white rounded-md p-3 border border-gray-200">
                                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                        {answer}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Answers */}
                            {otherAnswers && Object.keys(otherAnswers).length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-[#00A55F] mb-4 flex items-center gap-2">
                                        <FaUser className="h-4 w-4" />
                                        {t('recruiter.answersModal.additionalQuestionsAnswers')}
                                    </h3>
                                    <div className="space-y-4">
                                        {Object.entries(otherAnswers).map(([question, answer], index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="mb-2">
                                                    <h4 className="font-semibold text-gray-800 text-sm">
                                                        {question}
                                                    </h4>
                                                </div>
                                                <div className="bg-white rounded-md p-3 border border-gray-200">
                                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                        {answer}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Answers */}
                            {(!screeningAnswers || Object.keys(screeningAnswers).length === 0) &&
                                (!otherAnswers || Object.keys(otherAnswers).length === 0) && (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 text-lg mb-2">{t('recruiter.answersModal.noAnswersProvided')}</div>
                                        <p className="text-gray-500 text-sm">
                                            {t('recruiter.answersModal.noAnswersYet')}
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end p-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                        >
                            {t('recruiter.answersModal.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnswersModal; 