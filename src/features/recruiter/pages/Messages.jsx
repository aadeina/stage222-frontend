import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInbox, FaSearch, FaPaperPlane, FaUser, FaClock, FaCheck, FaCheckDouble } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Mock data for demonstration - replace with actual API calls
    const mockConversations = [
        {
            id: 1,
            candidate: {
                name: 'Sarah Johnson',
                avatar: null,
                email: 'sarah.johnson@email.com'
            },
            opportunity: {
                title: 'Frontend Developer Internship',
                company: 'TechCorp'
            },
            lastMessage: "Thank you for the opportunity! I'm excited to discuss this further.",
            lastMessageTime: '2 hours ago',
            unreadCount: 2,
            status: 'active'
        },
        {
            id: 2,
            candidate: {
                name: 'Michael Chen',
                avatar: null,
                email: 'michael.chen@email.com'
            },
            opportunity: {
                title: 'Data Science Internship',
                company: 'TechCorp'
            },
            lastMessage: 'When can we schedule the technical interview?',
            lastMessageTime: '1 day ago',
            unreadCount: 0,
            status: 'pending'
        },
        {
            id: 3,
            candidate: {
                name: 'Emily Rodriguez',
                avatar: null,
                email: 'emily.rodriguez@email.com'
            },
            opportunity: {
                title: 'Marketing Internship',
                company: 'TechCorp'
            },
            lastMessage: "I've completed the assignment you sent.",
            lastMessageTime: '3 days ago',
            unreadCount: 1,
            status: 'completed'
        }
    ];

    const mockMessages = {
        1: [
            {
                id: 1,
                sender: 'candidate',
                content: "Hi! I'm very interested in the Frontend Developer Internship position.",
                timestamp: '2024-01-15T10:00:00Z',
                status: 'read'
            },
            {
                id: 2,
                sender: 'recruiter',
                content: 'Hello Sarah! Thank you for your interest. Can you tell me about your experience with React?',
                timestamp: '2024-01-15T10:05:00Z',
                status: 'read'
            },
            {
                id: 3,
                sender: 'candidate',
                content: 'I have 2 years of experience with React, including building responsive web applications and working with state management libraries like Redux.',
                timestamp: '2024-01-15T10:10:00Z',
                status: 'read'
            },
            {
                id: 4,
                sender: 'candidate',
                content: "Thank you for the opportunity! I'm excited to discuss this further.",
                timestamp: '2024-01-15T12:00:00Z',
                status: 'delivered'
            }
        ]
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setConversations(mockConversations);
            setIsLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            setMessages(mockMessages[selectedConversation.id] || []);
        }
    }, [selectedConversation]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        setIsSending(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            const message = {
                id: Date.now(),
                sender: 'recruiter',
                content: newMessage.trim(),
                timestamp: new Date().toISOString(),
                status: 'sending'
            };

            setMessages(prev => [...prev, message]);
            setNewMessage('');

            // Update conversation last message
            setConversations(prev => prev.map(conv =>
                conv.id === selectedConversation.id
                    ? { ...conv, lastMessage: newMessage.trim(), lastMessageTime: 'Just now' }
                    : conv
            ));

            toast.success('Message sent successfully!');
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setIsSending(false);
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.opportunity.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-600';
            case 'pending': return 'text-yellow-600';
            case 'completed': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Active';
            case 'pending': return 'Pending';
            case 'completed': return 'Completed';
            default: return 'Unknown';
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A55F]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
                <div className="flex h-[600px]">
                    {/* Conversations List */}
                    <div className="w-1/3 border-r border-gray-200 flex flex-col">
                        {/* Search Header */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Conversations */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <FaInbox className="h-12 w-12 mb-4" />
                                    <p>No conversations found</p>
                                </div>
                            ) : (
                                filteredConversations.map((conversation) => (
                                    <motion.div
                                        key={conversation.id}
                                        whileHover={{ backgroundColor: '#f9fafb' }}
                                        onClick={() => setSelectedConversation(conversation)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedConversation?.id === conversation.id ? 'bg-[#00A55F] bg-opacity-10 border-l-4 border-l-[#00A55F]' : ''
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-[#00A55F] rounded-full flex items-center justify-center flex-shrink-0">
                                                <FaUser className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {conversation.candidate.name}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">
                                                        {conversation.lastMessageTime}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 truncate mt-1">
                                                    {conversation.opportunity.title}
                                                </p>
                                                <p className="text-sm text-gray-700 truncate mt-1">
                                                    {conversation.lastMessage}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(conversation.status)} bg-opacity-10`}>
                                                        {getStatusText(conversation.status)}
                                                    </span>
                                                    {conversation.unreadCount > 0 && (
                                                        <span className="bg-[#00A55F] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                                            {conversation.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-[#00A55F] rounded-full flex items-center justify-center">
                                            <FaUser className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {selectedConversation.candidate.name}
                                            </h3>
                                            <p className="text-xs text-gray-600">
                                                {selectedConversation.opportunity.title} • {selectedConversation.opportunity.company}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedConversation.status)} bg-opacity-10`}>
                                            {getStatusText(selectedConversation.status)}
                                        </span>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <FaInbox className="h-12 w-12 mb-4" />
                                            <p>No messages yet</p>
                                            <p className="text-sm">Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${message.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'recruiter'
                                                    ? 'bg-[#00A55F] text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                                    }`}>
                                                    <p className="text-sm">{message.content}</p>
                                                    <div className={`flex items-center justify-between mt-1 text-xs ${message.sender === 'recruiter' ? 'text-white text-opacity-80' : 'text-gray-500'
                                                        }`}>
                                                        <span>{formatTime(message.timestamp)}</span>
                                                        {message.sender === 'recruiter' && (
                                                            <span className="ml-2">
                                                                {message.status === 'sending' && <FaClock className="h-3 w-3" />}
                                                                {message.status === 'delivered' && <FaCheck className="h-3 w-3" />}
                                                                {message.status === 'read' && <FaCheckDouble className="h-3 w-3" />}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-200">
                                    <div className="flex space-x-3">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type your message..."
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-transparent"
                                            disabled={isSending}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || isSending}
                                            className="px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSending ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <FaPaperPlane className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <FaInbox className="h-16 w-16 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                                    <p className="text-sm">Choose a conversation from the list to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Messages; 