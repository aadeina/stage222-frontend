import React, { useState } from 'react';
import { FaTimes, FaDownload, FaEye, FaSpinner } from 'react-icons/fa';

// Professional resume modal component for viewing and downloading candidate resumes
// Features smooth animations, loading states, and professional design

const ResumeModal = ({ isOpen, onClose, resumeUrl, candidateName }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Handle download functionality
    const handleDownload = async () => {
        try {
            const response = await fetch(resumeUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const safeName = candidateName ? candidateName.replace(/\s+/g, '_') : 'Candidate';
            const fileName = `${safeName}_Resume_Stage222.pdf`;
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    // Handle iframe load
    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    // Handle iframe error
    const handleIframeError = () => {
        setIsLoading(false);
        setError('Failed to load resume. Please try downloading instead.');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Resume - {candidateName}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                View and download candidate resume
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Download Button */}
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors duration-200"
                            >
                                <FaDownload className="h-4 w-4" />
                                Download
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <FaTimes className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-hidden">
                        {isLoading && (
                            <div className="flex items-center justify-center h-64">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FaSpinner className="h-6 w-6 animate-spin" />
                                    <span>Loading resume...</span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors duration-200 mx-auto"
                                    >
                                        <FaDownload className="h-4 w-4" />
                                        Download Resume
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PDF Viewer */}
                        <div className="relative w-full h-full min-h-[500px]">
                            <iframe
                                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full border-0 rounded-lg"
                                onLoad={handleIframeLoad}
                                onError={handleIframeError}
                                title={`Resume - ${candidateName}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeModal; 