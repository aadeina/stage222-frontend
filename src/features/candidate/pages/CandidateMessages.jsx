// CandidateMessages.jsx
// World-class, professional candidate messages page for Stage222
// Inspired by Internshala, tailored for Mauritanian students and Stage222 branding
// Two-column layout: left for conversation list, right for selected thread
// Uses Mauritanian mock data in English for now; ready for API integration
// RESPONSIVE: Stacks vertically on mobile, horizontal scroll on desktop

import React, { useState } from 'react';
import { FaSearch, FaEnvelope, FaUser, FaPaperPlane, FaCheckCircle, FaBriefcase, FaRegStar, FaRegSmile } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mauritanian mock data for conversations (English)
const mockConversations = [
    {
        id: 1,
        company: 'MauriTech',
        logo: null,
        jobTitle: 'Full Stack & Data Engineering Internship | Chatting with Mohamed Ould Ahmed',
        jobType: 'Internship',
        lastMessage: 'Thank you for your application. Please complete this form to proceed.',
        date: '2024-06-12',
        unread: true,
        status: 'In Progress',
        messages: [
            {
                sender: 'MauriTech',
                text: 'Thank you for applying to MauriTech. Please complete this form: https://mauritech.mr/form. Salary: 8,000 MRU/month.',
                time: '09:15',
                date: '12 June 2024',
            },
            {
                sender: 'You',
                text: "Thank you! I will fill it out today.",
                time: '09:20',
                date: '12 June 2024',
            },
            {
                sender: 'MauriTech',
                text: 'Perfect! Let us know if you have any questions.',
                time: '09:22',
                date: '12 June 2024',
            },
        ],
    },
    {
        id: 2,
        company: 'Nouakchott Digital',
        logo: null,
        jobTitle: 'Business Analytics Internship | Chatting with Aissata Mint Sidi',
        jobType: 'Internship',
        lastMessage: 'Your interview is scheduled for tomorrow at 10am. Good luck!',
        date: '2024-06-10',
        unread: false,
        status: 'Interview',
        messages: [
            {
                sender: 'Nouakchott Digital',
                text: 'Your interview is scheduled for tomorrow at 10am at our Tevragh Zeina office.',
                time: '16:00',
                date: '10 June 2024',
            },
            {
                sender: 'You',
                text: 'Thank you for the opportunity. I will be there.',
                time: '16:05',
                date: '10 June 2024',
            },
        ],
    },
    {
        id: 3,
        company: 'Chinguetti Bank',
        logo: null,
        jobTitle: 'Finance & Accounting Internship | Chatting with Sidi El Mokhtar',
        jobType: 'Internship',
        lastMessage: 'Thank you for your response. We will get back to you soon.',
        date: '2024-06-08',
        unread: false,
        status: 'Pending',
        messages: [
            {
                sender: 'Chinguetti Bank',
                text: 'Thank you for your response. We will get back to you soon.',
                time: '11:30',
                date: '8 June 2024',
            },
        ],
    },
    {
        id: 4,
        company: 'Sahara Solutions',
        logo: null,
        jobTitle: 'Community Management Internship | Chatting with Zeinabou Mint Abdallahi',
        jobType: 'Internship',
        lastMessage: 'We are interested in your profile. Are you available for a call?',
        date: '2024-06-05',
        unread: true,
        status: 'New',
        messages: [
            {
                sender: 'Sahara Solutions',
                text: 'We are interested in your profile. Are you available for a call this week?',
                time: '14:00',
                date: '5 June 2024',
            },
        ],
    },
];

const CandidateMessages = () => {
    const [selectedId, setSelectedId] = useState(mockConversations[0]?.id || null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    // Filter and search logic
    const filteredConversations = mockConversations.filter(conv => {
        const matchesSearch = conv.company.toLowerCase().includes(search.toLowerCase()) || conv.jobTitle.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || (filter === 'unread' && conv.unread) || (filter === 'archived' && conv.status === 'Archived');
        return matchesSearch && matchesFilter;
    });
    const selectedConversation = mockConversations.find(c => c.id === selectedId);

    return (
        <div className="max-w-7xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
            {/* Section Header - Responsive layout */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Messages</h1>
                    <p className="text-gray-500 text-sm">Manage your conversations with Mauritanian employers.</p>
                </div>
                <button
                    onClick={() => navigate('/candidate/dashboard')}
                    className="bg-[#00A55F] text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-[#008c4f] transition"
                >
                    ← Back to Dashboard
                </button>
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
                                <div>No conversations found</div>
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
                                {selectedConversation.messages.map((message, index) => (
                                    <div key={index} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${message.sender === 'You' ? 'bg-[#00A55F] text-white' : 'bg-gray-100 text-gray-900'}`}>
                                            <p className="text-sm">{message.text}</p>
                                            <p className={`text-xs mt-1 ${message.sender === 'You' ? 'text-white/70' : 'text-gray-500'}`}>
                                                {message.time} • {message.date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input - Responsive padding */}
                            <div className="p-4 border-t bg-white">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A55F]"
                                    />
                                    <button className="p-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition">
                                        <FaPaperPlane className="h-4 w-4" />
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