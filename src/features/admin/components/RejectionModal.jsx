import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExclamationTriangle, FaPaperPlane } from 'react-icons/fa';

const RejectionModal = ({ isOpen, onClose, onReject, internshipTitle, loading }) => {
    const { t } = useTranslation();
    const [reason, setReason] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reason.trim()) {
            onReject(reason.trim());
            setReason('');
        }
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full">
                                        <FaExclamationTriangle className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {t('admin.components.rejectionModal.rejectInternship')}
                                        </h3>
                                        <p className="text-red-100 text-sm">
                                            {t('admin.components.rejectionModal.provideFeedback')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-white hover:text-red-100 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                                    disabled={loading}
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6">
                            <div className="mb-6">
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        {t('admin.components.rejectionModal.internshipDetails')}
                                    </h4>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="font-semibold text-gray-900 text-lg">{internshipTitle}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="rejection-reason" className="block text-sm font-semibold text-gray-700 mb-3">
                                        {t('admin.components.rejectionModal.rejectionReason')}
                                    </label>
                                    <textarea
                                        id="rejection-reason"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder={t('admin.components.rejectionModal.rejectionPlaceholder')}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all duration-200"
                                        rows={5}
                                        required
                                        disabled={loading}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        {reason.length}/500 {t('admin.components.rejectionModal.characters')}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {t('admin.components.rejectionModal.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading || !reason.trim()}
                                    className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 border border-transparent rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {t('admin.components.rejectionModal.rejecting')}
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="w-4 h-4" />
                                            {t('admin.components.rejectionModal.rejectInternshipButton')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RejectionModal; 