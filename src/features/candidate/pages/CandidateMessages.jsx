// CandidateMessages.jsx
// World-class, professional candidate messages page for Stage222
// Integrated with real Django backend messaging API
// Two-column layout: left for conversation list, right for selected thread
// RESPONSIVE: Stacks vertically on mobile, horizontal scroll on desktop

import React, { useState, useEffect } from 'react';
import { FaSearch, FaEnvelope, FaUser, FaPaperPlane, FaCheckCircle, FaBriefcase, FaRegStar, FaRegSmile } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import messagingApi from '../../../services/messagingApi';
import toast from 'react-hot-toast';

const CandidateMessages = () => {
    // Check if user is authenticated - moved to top to avoid initialization error
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isAuthenticated = !!currentUser.email;

    const [conversations, setConversations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [inboxLoaded, setInboxLoaded] = useState(false);
    const navigate = useNavigate();

    // ✅ Load inbox conversations from API
    const loadInbox = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching inbox from API...');

            const response = await messagingApi.getInbox();
            const inboxData = response.data;

            console.log('Candidate Inbox API Response:', inboxData);

            // Handle different response structures
            const inboxArray = Array.isArray(inboxData) ? inboxData :
                inboxData.results ? inboxData.results :
                    inboxData.conversations ? inboxData.conversations : [];

            console.log('Processed inbox array:', inboxArray);

            // Transform API data to match our UI structure
            const transformedConversations = inboxArray.map((item, index) => {
                // Extract user info - handle different possible structures
                const userEmail = item.user_email || item.email || item.sender_email || 'unknown@email.com';
                const userId = item.user_id || item.id || `user_${index}`;
                const internshipTitle = item.internship_title || item.title || 'General Inquiry';

                // Create a more readable company name
                let companyName = 'Recruiter';
                if (userEmail && userEmail !== 'unknown@email.com') {
                    const emailParts = userEmail.split('@');
                    if (emailParts.length > 1) {
                        const domain = emailParts[1];
                        // Extract company name from domain
                        if (domain.includes('gmail')) {
                            companyName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
                        } else {
                            companyName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
                        }
                    }
                }

                return {
                    id: index + 1,
                    user_id: userId,
                    company: companyName,
                    logo: null,
                    jobTitle: `${internshipTitle} | Chatting with ${companyName}`,
                    jobType: 'Internship',
                    lastMessage: item.message || item.body || 'No message content',
                    date: formatDate(item.timestamp),
                    unread: !item.is_read,
                    status: getStatusFromMessage(item.message || item.body || ''),
                    messages: [], // Will be loaded when conversation is selected
                    timestamp: item.timestamp
                };
            });

            console.log('Transformed conversations:', transformedConversations);
            setConversations(transformedConversations);
            setInboxLoaded(true); // Mark inbox as loaded

            // Only set selected conversation if we have conversations and none is selected
            if (transformedConversations.length > 0 && !selectedId) {
                console.log('Setting first conversation as selected:', transformedConversations[0]);
                setSelectedId(transformedConversations[0].id);
            }
        } catch (error) {
            console.error('Failed to load inbox:', error);

            // Handle specific error types
            if (error.response?.status === 403) {
                toast.error('Authentication required. Please log in again.');
                // Redirect to login if authentication fails
                setTimeout(() => navigate('/login'), 2000);
            } else if (error.response?.status === 404) {
                toast.error('No conversations found.');
                setConversations([]);
            } else {
                toast.error('Failed to load conversations. Please try again.');
                setConversations([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Load messages for a specific conversation
    const loadMessages = async (userId) => {
        // Validate userId before making API call
        if (!userId || userId === 'undefined' || userId.includes('user_')) {
            console.log('Invalid userId, skipping message load:', userId);
            return;
        }

        try {
            setLoadingMessages(true);
            console.log('Loading messages for userId:', userId);

            const response = await messagingApi.getMessagesWithUser(userId);
            const messagesData = response.data;

            console.log('Messages API Response:', messagesData);

            // Handle different response structures
            const messagesArray = Array.isArray(messagesData) ? messagesData :
                messagesData.results ? messagesData.results :
                    messagesData.messages ? messagesData.messages : [];

            console.log('Processed messages array:', messagesArray);

            // Get current user email from localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const currentUserEmail = currentUser.email;

            // Transform API messages to match our UI structure
            const transformedMessages = messagesArray.map((msg) => {
                const senderEmail = msg.sender_email || msg.email || 'unknown@email.com';
                const isCurrentUser = senderEmail === currentUserEmail;

                // Create a readable sender name
                let senderName = 'You';
                if (!isCurrentUser) {
                    const emailParts = senderEmail.split('@');
                    if (emailParts.length > 1) {
                        const domain = emailParts[1];
                        if (domain.includes('gmail')) {
                            senderName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
                        } else {
                            senderName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
                        }
                    }
                }

                return {
                    sender: isCurrentUser ? 'You' : senderName,
                    text: msg.body || msg.message || 'No message content',
                    time: formatTime(msg.timestamp),
                    date: formatDate(msg.timestamp),
                    is_read: msg.is_read
                };
            });

            // Update the selected conversation with messages
            setConversations(prev => prev.map(conv =>
                conv.user_id === userId
                    ? { ...conv, messages: transformedMessages }
                    : conv
            ));

            // Mark unread messages as read
            const unreadMessages = messagesArray.filter(msg => !msg.is_read && msg.sender_email !== currentUserEmail);
            for (const msg of unreadMessages) {
                try {
                    await messagingApi.markMessageAsRead(msg.id);
                } catch (error) {
                    console.error('Failed to mark message as read:', error);
                }
            }
        } catch (error) {
            console.error('Failed to load messages:', error);

            // Handle specific error types
            if (error.response?.status === 403) {
                toast.error('Authentication required. Please log in again.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (error.response?.status === 404) {
                toast.error('No messages found for this conversation.');
            } else {
                toast.error('Failed to load messages. Please try again.');
            }
        } finally {
            setLoadingMessages(false);
        }
    };

    // ✅ Send a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        setIsSending(true);

        try {
            const messageData = {
                receiver: selectedConversation.user_id,
                internship: null, // Candidates don't send internship-specific messages
                body: newMessage.trim()
            };

            const response = await messagingApi.sendMessage(messageData);
            const sentMessage = response.data;

            // Add the new message to the conversation
            const newMessageObj = {
                sender: 'You',
                text: newMessage.trim(),
                time: formatTime(new Date().toISOString()),
                date: formatDate(new Date().toISOString()),
                is_read: false
            };

            // Update conversation with new message
            setConversations(prev => prev.map(conv =>
                conv.id === selectedId
                    ? {
                        ...conv,
                        messages: [...conv.messages, newMessageObj],
                        lastMessage: newMessage.trim(),
                        date: 'Just now',
                        unread: false
                    }
                    : conv
            ));

            setNewMessage('');
            toast.success('Message sent successfully!');
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        } finally {
            setIsSending(false);
        }
    };

    // ✅ Format timestamp for display
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // ✅ Format date for display
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString();
    };

    // ✅ Get status from message content
    const getStatusFromMessage = (message) => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('interview') || lowerMessage.includes('meeting')) return 'Interview';
        if (lowerMessage.includes('accepted') || lowerMessage.includes('congratulations')) return 'In Progress';
        if (lowerMessage.includes('rejected') || lowerMessage.includes('unfortunately')) return 'Rejected';
        return 'New';
    };

    // ✅ Load inbox on component mount
    useEffect(() => {
        if (isAuthenticated && !inboxLoaded) {
            console.log('Loading inbox for authenticated user:', currentUser.email);
            loadInbox();
        }
    }, [isAuthenticated, inboxLoaded]);

    // ✅ Load messages when conversation is selected
    useEffect(() => {
        if (selectedId && conversations.length > 0) {
            const selectedConv = conversations.find(c => c.id === selectedId);
            if (selectedConv && selectedConv.user_id) {
                console.log('Loading messages for conversation:', selectedConv);
                loadMessages(selectedConv.user_id);
            }
        }
    }, [selectedId]); // Only depend on selectedId, not conversations

    // Filter and search logic
    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = conv.company.toLowerCase().includes(search.toLowerCase()) || conv.jobTitle.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || (filter === 'unread' && conv.unread) || (filter === 'archived' && conv.status === 'Archived');
        return matchesSearch && matchesFilter;
    });

    const selectedConversation = conversations.find(c => c.id === selectedId);



    if (!isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
                        <p className="text-gray-600 mb-4">Please log in to view your messages.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-[#00A55F] text-white px-4 py-2 rounded-lg hover:bg-[#008c4f] transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A55F]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
            {/* Debug Info - Remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>Debug:</strong> User: {currentUser.email || 'Not logged in'} |
                        Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}
                    </p>
                </div>
            )}

            {/* Section Header - Responsive layout */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Messages</h1>
                    <p className="text-gray-500 text-sm">Manage your conversations with Mauritanian employers.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setInboxLoaded(false);
                            loadInbox();
                        }}
                        disabled={isLoading}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : '🔄 Refresh'}
                    </button>
                    <button
                        onClick={() => navigate('/candidate/dashboard')}
                        className="bg-[#00A55F] text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-[#008c4f] transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Main Card - Responsive two-column layout */}
            <div className="flex flex-col lg:flex-row bg-white min-h-[70vh] border rounded-xl shadow overflow-hidden">
                {/* Left: Conversation List - Full width on mobile, 1/3 on desktop */}
                <aside className="w-full lg:w-1/3 border-r bg-gray-50 flex flex-col">
                    {/* Search and Filters - Responsive padding */}
                    <div className="p-4 border-b bg-white">
                        <div className="flex items-center gap-2 mb-3">
                            <FaSearch className="text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search company or job..."
                                className="flex-1 border-none outline-none bg-transparent text-sm"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button
                                className={`text-xs px-3 py-1 rounded-full font-medium border transition ${filter === 'all' ? 'bg-[#00A55F] text-white border-[#00A55F]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`text-xs px-3 py-1 rounded-full font-medium border transition ${filter === 'unread' ? 'bg-[#00A55F] text-white border-[#00A55F]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                                onClick={() => setFilter('unread')}
                            >
                                Unread
                            </button>
                        </div>
                    </div>
                    {/* Conversation List - Scrollable on mobile */}
                    <div className="overflow-y-auto flex-1">
                        {filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
                                <FaRegSmile className="text-5xl mb-2" />
                                <div className="text-center">
                                    <p className="mb-2">No conversations found</p>
                                    <p className="text-sm text-gray-500">Start applying to internships to receive messages from recruiters!</p>
                                </div>
                            </div>
                        ) : (
                            filteredConversations.map(conv => (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedId(conv.id)}
                                    className={`cursor-pointer px-4 py-4 border-b hover:bg-[#e6f7f0] transition flex items-start space-x-3 ${selectedId === conv.id ? 'bg-[#d1fae5]' : ''}`}
                                >
                                    {/* Avatar or Initials */}
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                                        style={{ background: 'linear-gradient(135deg, #00A55F 60%, #008c4f 100%)', color: 'white' }}>
                                        {conv.logo ? <img src={conv.logo} alt={conv.company} className="w-10 h-10 rounded-full object-cover" /> : conv.company[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-900 truncate">{conv.company}</span>
                                            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{conv.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">{conv.jobType}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conv.status === 'In Progress' ? 'bg-green-100 text-green-800' : conv.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' : conv.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>{conv.status}</span>
                                            {conv.unread && <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>}
                                        </div>
                                        <div className="text-xs text-gray-600 truncate mt-1">{conv.jobTitle}</div>
                                        <div className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                {/* Right: Chat Area - Full width on mobile, 2/3 on desktop */}
                <div className="w-full lg:w-2/3 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header - Responsive padding */}
                            <div className="p-4 border-b bg-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                                            style={{ background: 'linear-gradient(135deg, #00A55F 60%, #008c4f 100%)', color: 'white' }}>
                                            {selectedConversation.logo ? <img src={selectedConversation.logo} alt={selectedConversation.company} className="w-10 h-10 rounded-full object-cover" /> : selectedConversation.company[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{selectedConversation.company}</h3>
                                            <p className="text-sm text-gray-600 truncate">{selectedConversation.jobTitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${selectedConversation.status === 'In Progress' ? 'bg-green-100 text-green-800' : selectedConversation.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' : selectedConversation.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {selectedConversation.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A55F]"></div>
                                    </div>
                                ) : selectedConversation.messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <FaEnvelope className="h-12 w-12 mb-4" />
                                        <p>No messages yet</p>
                                        <p className="text-sm">Start the conversation!</p>
                                    </div>
                                ) : (
                                    selectedConversation.messages.map((message, index) => (
                                        <div key={index} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${message.sender === 'You' ? 'bg-[#00A55F] text-white' : 'bg-gray-100 text-gray-900'}`}>
                                                <p className="text-sm">{message.text}</p>
                                                <p className={`text-xs mt-1 ${message.sender === 'You' ? 'text-white/70' : 'text-gray-500'}`}>
                                                    {message.time} • {message.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Message Input - Responsive padding */}
                            <div className="p-4 border-t bg-white">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your message..."
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A55F]"
                                        disabled={isSending}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim() || isSending}
                                        className="p-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                        // Empty State - Responsive centering
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center text-gray-400">
                                <FaEnvelope className="h-16 w-16 mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                                <p className="text-sm">Choose a conversation from the list to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateMessages; 