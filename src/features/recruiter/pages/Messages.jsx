import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInbox, FaSearch, FaPaperPlane, FaUser, FaClock, FaCheck, FaCheckDouble, FaArrowLeft } from 'react-icons/fa';
import messagingApi from '../../../services/messagingApi';
import toast from 'react-hot-toast';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // ✅ Load inbox conversations from API
    const loadInbox = async () => {
        try {
            setIsLoading(true);
            const response = await messagingApi.getInbox();
            const inboxData = response.data;

            console.log('Inbox API Response:', inboxData);

            // Handle different response structures
            const inboxArray = Array.isArray(inboxData) ? inboxData :
                inboxData.results ? inboxData.results :
                    inboxData.conversations ? inboxData.conversations : [];

            // Transform API data to match our UI structure
            const transformedConversations = inboxArray.map((item, index) => ({
                id: index + 1, // Use index as ID since we don't have conversation ID
                user_id: item.user_id,
            candidate: {
                    name: item.user_email.split('@')[0], // Use email prefix as name
                avatar: null,
                    email: item.user_email
            },
            opportunity: {
                    title: item.internship_title || 'General Inquiry',
                    company: 'Stage222'
                },
                lastMessage: item.message,
                lastMessageTime: formatTime(item.timestamp),
                unreadCount: item.is_read ? 0 : 1,
                status: 'active',
                timestamp: item.timestamp
            }));

            setConversations(transformedConversations);
        } catch (error) {
            console.error('Failed to load inbox:', error);
            toast.error('Failed to load conversations');
            // Set empty conversations array on error
            setConversations([]);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Load messages for a specific conversation
    const loadMessages = async (userId) => {
        try {
            setLoadingMessages(true);
            const response = await messagingApi.getMessagesWithUser(userId);
            const messagesData = response.data;

            // Debug: Log the response structure
            console.log('Messages API Response:', messagesData);
            console.log('Response type:', typeof messagesData);
            console.log('Is Array:', Array.isArray(messagesData));

            // Handle different response structures
            const messagesArray = Array.isArray(messagesData) ? messagesData :
                messagesData.results ? messagesData.results :
                    messagesData.messages ? messagesData.messages : [];

            console.log('Processed messages array:', messagesArray);

            // Get current user email from localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const currentUserEmail = currentUser.email;

            // Transform API messages to match our UI structure
            const transformedMessages = messagesArray.length > 0 ? messagesArray.map((msg, index) => {
                const senderEmail = msg.sender_email || msg.email || 'unknown@email.com';
                const senderId = msg.sender || msg.sender_id;
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
                    id: index + 1,
                    sender: isCurrentUser ? 'You' : senderName,
                    senderId: senderId,
                    senderEmail: senderEmail,
                    content: msg.body || msg.message || 'No message content',
                    timestamp: msg.timestamp,
                    status: msg.is_read ? 'read' : 'delivered',
                    is_read: msg.is_read
                };
            }) : [];

            setMessages(transformedMessages);

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
            toast.error('Failed to load messages');
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
                internship: selectedConversation.opportunity.internship_id || null,
                body: newMessage.trim()
            };

            const response = await messagingApi.sendMessage(messageData);
            const sentMessage = response.data;

            // Add the new message to the conversation
            const newMessageObj = {
                id: Date.now(),
                sender: 'recruiter',
                content: newMessage.trim(),
                timestamp: new Date().toISOString(),
                status: 'sending'
            };

            setMessages(prev => [...prev, newMessageObj]);
            setNewMessage('');

            // Update conversation last message
            setConversations(prev => prev.map(conv =>
                conv.id === selectedConversation.id
                    ? {
                        ...conv,
                        lastMessage: newMessage.trim(),
                        lastMessageTime: 'Just now',
                        unreadCount: 0
                    }
                    : conv
            ));

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
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString();
    };

    // ✅ Load inbox on component mount
    useEffect(() => {
        loadInbox();
    }, []);

    // ✅ Load messages when conversation is selected
    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.user_id);
        }
    }, [selectedConversation]);

    // ✅ Filter conversations based on search
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
                <div className="flex flex-col lg:flex-row h-[600px]">
                    {/* Conversations List */}
                    <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
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

                    {/* Mobile Chat Area */}
                    {selectedConversation && (
                        <div className="lg:hidden flex-1 flex flex-col">
                            {/* Mobile Chat Header */}
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setSelectedConversation(null)}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <FaArrowLeft className="h-4 w-4" />
                                    </button>
                                    <div className="w-8 h-8 bg-[#00A55F] rounded-full flex items-center justify-center">
                                        <FaUser className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            {selectedConversation.candidate.name}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            {selectedConversation.opportunity.title}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedConversation.status)} bg-opacity-10`}>
                                        {getStatusText(selectedConversation.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Mobile Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A55F]"></div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <FaInbox className="h-12 w-12 mb-4" />
                                        <p>No messages yet</p>
                                    </div>
                                ) : (
                                    messages.map((message) => {
                                        // Check if sender is current user using ID comparison
                                        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                                        const isCurrentUser = message.senderId === currentUser.id || message.sender === 'You';

                                        return (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
                                            >
                                                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                                    {/* Avatar/Initials */}
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCurrentUser
                                                        ? 'bg-[#00A55F] text-white'
                                                        : 'bg-gray-300 text-gray-700'
                                                        }`}>
                                                        {isCurrentUser
                                                            ? (currentUser.name ? currentUser.name[0] : 'Y')
                                                            : (message.sender !== 'You' ? message.sender[0] : 'C')
                                                        }
                                                    </div>

                                                    {/* Message Bubble */}
                                                    <div className={`px-4 py-3 rounded-xl shadow-sm ${isCurrentUser
                                                ? 'bg-[#00A55F] text-white'
                                                        : 'bg-[#F1F5F9] text-black'
                                                        }`}>
                                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                                        <div className={`flex items-center justify-between mt-2 text-xs ${isCurrentUser ? 'text-white/80' : 'text-gray-500'
                                                            }`}>
                                                            <span>{formatTime(message.timestamp)}</span>
                                                            {isCurrentUser && (
                                                                <span className="ml-2">
                                                                    {message.status === 'sending' && <FaClock className="h-3 w-3" />}
                                                                    {message.status === 'delivered' && <FaCheck className="h-3 w-3" />}
                                                                    {message.status === 'read' && <FaCheckDouble className="h-3 w-3" />}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                            </div>
                                        </motion.div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Mobile Message Input */}
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex items-end space-x-2">
                                    <div className="flex-1 bg-gray-50 rounded-2xl px-3 py-2 border border-gray-200 focus-within:border-[#00A55F] focus-within:ring-2 focus-within:ring-[#00A55F]/20 transition-all">
                                        <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                        placeholder="Type a message..."
                                            className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
                                            rows="1"
                                            disabled={isSending}
                                            style={{ minHeight: '20px', maxHeight: '100px' }}
                                    />
                                    </div>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim() || isSending}
                                        className="p-2 bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                    >
                                        {isSending ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            <FaPaperPlane className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop Chat Area */}
                    <div className="flex-1 flex flex-col hidden lg:flex">
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
                                    {loadingMessages ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A55F]"></div>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <FaInbox className="h-12 w-12 mb-4" />
                                            <p>No messages yet</p>
                                            <p className="text-sm">Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => {
                                            // Check if sender is current user using ID comparison
                                            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                                            const isCurrentUser = message.senderId === currentUser.id || message.sender === 'You';

                                            return (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
                                                >
                                                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                                        {/* Avatar/Initials */}
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCurrentUser
                                                            ? 'bg-[#00A55F] text-white'
                                                            : 'bg-gray-300 text-gray-700'
                                                            }`}>
                                                            {isCurrentUser
                                                                ? (currentUser.name ? currentUser.name[0] : 'Y')
                                                                : (message.sender !== 'You' ? message.sender[0] : 'C')
                                                            }
                                                        </div>

                                                        {/* Message Bubble */}
                                                        <div className={`px-4 py-3 rounded-xl shadow-sm ${isCurrentUser
                                                    ? 'bg-[#00A55F] text-white'
                                                            : 'bg-[#F1F5F9] text-black'
                                                    }`}>
                                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                                            <div className={`flex items-center justify-between mt-2 text-xs ${isCurrentUser ? 'text-white/80' : 'text-gray-500'
                                                        }`}>
                                                        <span>{formatTime(message.timestamp)}</span>
                                                                {isCurrentUser && (
                                                            <span className="ml-2">
                                                                {message.status === 'sending' && <FaClock className="h-3 w-3" />}
                                                                {message.status === 'delivered' && <FaCheck className="h-3 w-3" />}
                                                                {message.status === 'read' && <FaCheckDouble className="h-3 w-3" />}
                                                            </span>
                                                        )}
                                                            </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-200 bg-white">
                                    <div className="flex items-end space-x-3">
                                        <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-[#00A55F] focus-within:ring-2 focus-within:ring-[#00A55F]/20 transition-all">
                                            <textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                            placeholder="Type your message..."
                                                className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
                                                rows="1"
                                            disabled={isSending}
                                                style={{ minHeight: '20px', maxHeight: '120px' }}
                                        />
                                        </div>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || isSending}
                                            className="p-3 bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
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