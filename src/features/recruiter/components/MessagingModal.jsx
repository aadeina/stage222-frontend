import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaUser, FaEnvelope } from 'react-icons/fa';
import messagingApi from '../../../services/messagingApi';
import toast from 'react-hot-toast';

const MessagingModal = ({ isOpen, onClose, candidate, internship }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        setIsSending(true);
        try {
            const messageData = {
                receiver: candidate.id, // Candidate user ID
                internship: internship?.id || null,
                body: message.trim()
            };

            await messagingApi.sendMessage(messageData);
            toast.success('Message sent successfully!');
            setMessage('');
            onClose();
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    {/* Background overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                        <FaUser className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Send Message</h3>
                                        <p className="text-sm text-white text-opacity-90">to {candidate?.name || 'Candidate'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <FaTimes className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4">
                            {/* Candidate Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center space-x-3">
                                    {candidate?.photo ? (
                                        <img
                                            src={candidate.photo}
                                            alt={candidate.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#00A55F] to-[#008c4f] rounded-full flex items-center justify-center">
                                            <FaUser className="h-6 w-6 text-white" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{candidate?.name || 'Candidate'}</h4>
                                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                                            <FaEnvelope className="h-3 w-3" />
                                            <span>{candidate?.email || 'candidate@email.com'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message here..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-transparent resize-none"
                                    rows={4}
                                    disabled={isSending}
                                />
                                <p className="text-xs text-gray-500">
                                    Press Enter to send, Shift+Enter for new line
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                disabled={isSending}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || isSending}
                                className="px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                            >
                                {isSending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="h-4 w-4" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default MessagingModal; 