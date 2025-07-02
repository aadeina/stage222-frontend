// CandidateBookmarks.jsx
// World-class, professional bookmarks page for Stage222
// Inspired by Internshala, tailored for Mauritanian students and Stage222 branding
// Card/List: Internship/Job Title | Company | Badges | Details | Actions
// Uses Mauritanian mock data for now; ready for API integration
// RESPONSIVE: Cards stack vertically on mobile, badges wrap

import React from 'react';
import { FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaBolt, FaStar, FaRegBookmark, FaBriefcase, FaUserFriends, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Mauritanian mock data for bookmarks
const mockBookmarks = [
    {
        id: 1,
        title: 'Digital Marketing',
        company: 'Sahara Media',
        logo: null,
        activelyHiring: true,
        location: 'Work from home',
        duration: '1 Month',
        stipend: '3,000 MRU/month',
        posted: 'Just now',
        earlyApplicant: true,
        partTime: true,
        jobOffer: false,
        applicants: 12,
    },
    {
        id: 2,
        title: 'Full Stack Development',
        company: 'Nouakchott Tech',
        logo: null,
        activelyHiring: true,
        location: 'Nouakchott',
        duration: '6 Months',
        stipend: '7,000 - 7,500 MRU/month',
        posted: 'Just now',
        earlyApplicant: true,
        partTime: true,
        jobOffer: '80,000 MRU post internship',
        applicants: 8,
    },
    {
        id: 3,
        title: 'Artificial Intelligence (AI)',
        company: 'DeepThought Mauritania',
        logo: null,
        activelyHiring: true,
        location: 'Work from home',
        duration: '6 Months',
        stipend: '2,000 MRU/month',
        posted: '2 days ago',
        earlyApplicant: true,
        partTime: true,
        jobOffer: false,
        applicants: 1000,
    },
];

const CandidateBookmarks = () => {
    return (
        <div className="max-w-7xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
            {/* Header - Responsive text sizing */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Bookmarks</h1>
                <p className="text-gray-500 text-sm">Your bookmarked internships/jobs will be automatically removed from here whenever their application deadline is over or application window is closed.</p>
            </div>

            {/* Bookmarks List - Responsive card layout */}
            <div className="space-y-6">
                {mockBookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <FaRegBookmark className="text-5xl mb-2" />
                        <div>No bookmarks found</div>
                    </div>
                ) : (
                    mockBookmarks.map(bookmark => (
                        <motion.div
                            key={bookmark.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * bookmark.id }}
                            className="bg-white border rounded-xl shadow hover:shadow-md transition p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-4"
                        >
                            {/* Left: Logo/Initials and Title - Responsive layout */}
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl bg-gradient-to-br from-[#00A55F] to-[#008c4f] text-white flex-shrink-0">
                                    {bookmark.logo ? <img src={bookmark.logo} alt={bookmark.company} className="w-12 h-12 rounded-full object-cover" /> : bookmark.company[0]}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-semibold text-gray-900 text-lg truncate">{bookmark.title}</span>
                                        {bookmark.activelyHiring && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">Actively hiring</span>}
                                    </div>
                                    <div className="text-xs text-gray-600 truncate">{bookmark.company}</div>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="inline-flex items-center text-xs text-gray-500"><FaMapMarkerAlt className="mr-1" />{bookmark.location}</span>
                                        <span className="inline-flex items-center text-xs text-gray-500"><FaClock className="mr-1" />{bookmark.duration}</span>
                                        <span className="inline-flex items-center text-xs text-gray-500"><FaMoneyBillWave className="mr-1" />{bookmark.stipend}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Right: Badges and Actions - Responsive stacking */}
                            <div className="flex flex-col items-start lg:items-end gap-2 min-w-0 lg:min-w-[180px]">
                                <div className="flex flex-wrap gap-2 mb-1 w-full lg:w-auto">
                                    {bookmark.earlyApplicant && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><FaBolt className="mr-1" />Be an early applicant</span>}
                                    {bookmark.jobOffer && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><FaStar className="mr-1" />Job offer up to {bookmark.jobOffer}</span>}
                                    {bookmark.partTime && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><FaBriefcase className="mr-1" />Part time</span>}
                                </div>
                                <div className="flex items-center gap-2 w-full lg:w-auto">
                                    {bookmark.applicants && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><FaUserFriends className="mr-1" />{bookmark.applicants}+ applicants</span>}
                                    <button className="text-[#00A55F] hover:text-[#008c4f] text-xs font-medium flex items-center gap-1">
                                        View details <FaChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{bookmark.posted}</div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CandidateBookmarks; 