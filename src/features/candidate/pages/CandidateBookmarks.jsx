// CandidateBookmarks.jsx
// World-class, professional bookmarks page for Stage222
// Inspired by modern SaaS platforms, tailored for Mauritanian students and Stage222 branding
// Card/List: Internship/Job Title | Company | Badges | Details | Actions
// Uses real API data for bookmarked internships
// RESPONSIVE: Cards stack vertically on mobile, badges wrap

import React, { useState, useEffect } from 'react';
import {
    FaMapMarkerAlt,
    FaClock,
    FaMoneyBillWave,
    FaBolt,
    FaStar,
    FaRegBookmark,
    FaBriefcase,
    FaUserFriends,
    FaChevronRight,
    FaSpinner,
    FaTimes,
    FaSearch,
    FaFilter,
    FaBookmark as FaBookmarkSolid,
    FaBuilding,
    FaCalendarAlt,
    FaEye,
    FaTrash,
    FaHeart,
    FaShareAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import moment from 'moment';

const CandidateBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const navigate = useNavigate();

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bookmarks/');
            const bookmarksData = response.data.results || [];

            // Fetch internship details for each bookmark
            const bookmarksWithDetails = await Promise.all(
                bookmarksData.map(async (bookmark) => {
                    try {
                        const internshipResponse = await api.get(`/internships/${bookmark.internship}/`);
                        return {
                            ...bookmark,
                            internshipDetails: internshipResponse.data
                        };
                    } catch (error) {
                        console.error(`Error fetching internship ${bookmark.internship}:`, error);
                        return bookmark;
                    }
                })
            );

            setBookmarks(bookmarksWithDetails);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            setError('Failed to load bookmarks');
            toast.error('Failed to load bookmarks');
        } finally {
            setLoading(false);
        }
    };

    const removeBookmark = async (bookmarkId, internshipId) => {
        try {
            await api.post(`/bookmarks/${internshipId}/`);
            setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
            toast.success('Removed from bookmarks');
        } catch (error) {
            console.error('Error removing bookmark:', error);
            toast.error('Failed to remove bookmark');
        }
    };

    const navigateToInternship = (internshipId) => {
        navigate(`/candidate/internships/${internshipId}`);
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    // Filter and search bookmarks
    const filteredBookmarks = bookmarks.filter(bookmark => {
        const internship = bookmark.internshipDetails;
        if (!internship) return false;

        const matchesSearch = internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === 'all' ||
            (filterType === 'paid' && internship.stipend_type === 'paid') ||
            (filterType === 'unpaid' && internship.stipend_type === 'unpaid') ||
            (filterType === 'remote' && internship.location?.toLowerCase().includes('work from home'));

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00A55F] to-[#008c4f] bg-clip-text text-transparent">
                                    My Bookmarks
                                </h1>
                                <p className="text-gray-600 mt-2">Your saved opportunities and internships</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#00A55F] to-[#008c4f] rounded-full flex items-center justify-center">
                                    <FaBookmarkSolid className="text-white text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col items-center justify-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-[#00A55F] border-t-transparent rounded-full mb-6"
                        />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your bookmarks</h3>
                        <p className="text-gray-500">Fetching your saved opportunities...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00A55F] to-[#008c4f] bg-clip-text text-transparent">
                                    My Bookmarks
                                </h1>
                                <p className="text-gray-600 mt-2">Your saved opportunities and internships</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col items-center justify-center py-20">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6"
                        >
                            <FaTimes className="text-red-500 text-2xl" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load bookmarks</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-md">
                            We couldn't load your bookmarks. Please check your connection and try again.
                        </p>
                        <button
                            onClick={fetchBookmarks}
                            className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00A55F] to-[#008c4f] bg-clip-text text-transparent">
                                My Bookmarks
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {bookmarks.length} saved {bookmarks.length === 1 ? 'opportunity' : 'opportunities'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#00A55F] to-[#008c4f] rounded-xl flex items-center justify-center shadow-lg">
                                <FaBookmarkSolid className="text-white text-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search bookmarks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                            >
                                <option value="all">All Types</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="remote">Remote</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence mode="wait">
                    {filteredBookmarks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <FaRegBookmark className="text-gray-400 text-3xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {bookmarks.length === 0 ? 'No bookmarks yet' : 'No matching bookmarks'}
                            </h3>
                            <p className="text-gray-500 text-center max-w-md mb-6">
                                {bookmarks.length === 0
                                    ? 'Start bookmarking internships and jobs to see them here. Your bookmarks will be automatically removed when applications close.'
                                    : 'Try adjusting your search or filter criteria.'
                                }
                            </p>
                            {bookmarks.length === 0 && (
                                <button
                                    onClick={() => navigate('/candidate/internships')}
                                    className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    Browse Internships
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredBookmarks.map((bookmark, index) => {
                                const internship = bookmark.internshipDetails;
                                if (!internship) return null;

                                const formatStipend = () => {
                                    if (!internship) return '';
                                    if (internship.stipend_type === 'paid') {
                                        if (internship.stipend && internship.fixed_pay_max && internship.stipend !== internship.fixed_pay_max) {
                                            return `MRU ${internship.stipend} - ${internship.fixed_pay_max}`;
                                        } else if (internship.stipend) {
                                            return `MRU ${internship.stipend}`;
                                        } else {
                                            return 'Paid';
                                        }
                                    } else {
                                        return 'Unpaid';
                                    }
                                };

                                const formatDuration = () => {
                                    if (!internship) return '';
                                    return internship.duration || (internship.duration_weeks ? `${internship.duration_weeks} Weeks` : '');
                                };

                                const formatPostedTime = () => {
                                    if (!internship?.created_at) return '';
                                    return moment(internship.created_at).fromNow();
                                };

                                const isActivelyHiring = internship?.approval_status === 'approved';

                                return (
                                    <motion.div
                                        key={bookmark.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                                {/* Company Logo and Info */}
                                                <div className="flex items-start gap-4 flex-shrink-0">
                                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00A55F] to-[#008c4f] flex items-center justify-center shadow-lg">
                                                        {internship.organization?.logo ? (
                                                            <img
                                                                src={internship.organization.logo.startsWith('http')
                                                                    ? internship.organization.logo
                                                                    : `${import.meta.env.VITE_MEDIA_BASE_URL}${internship.organization.logo}`}
                                                                alt={internship.organization?.name}
                                                                className="w-16 h-16 rounded-xl object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-white font-bold text-xl">
                                                                {internship.organization?.name?.[0] || 'C'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="text-xl font-bold text-gray-900 truncate">
                                                                {internship.title}
                                                            </h3>
                                                            {isActivelyHiring && (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                                    <FaBolt className="mr-1" />
                                                                    Actively Hiring
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-lg font-medium text-gray-700 mb-1">
                                                            {internship.organization?.name}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <FaMapMarkerAlt className="text-[#00A55F]" />
                                                                {internship.location || 'Work from home'}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <FaClock className="text-[#00A55F]" />
                                                                {formatDuration()}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <FaMoneyBillWave className="text-[#00A55F]" />
                                                                {formatStipend()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Badges and Actions */}
                                                <div className="flex flex-col lg:items-end gap-4 flex-1">
                                                    {/* Badges */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {internship.early_applicant && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                                <FaBolt className="mr-1" />
                                                                Early Applicant
                                                            </span>
                                                        )}
                                                        {internship.job_offer && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                                <FaStar className="mr-1" />
                                                                Job Offer
                                                            </span>
                                                        )}
                                                        {internship.part_time && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                                                <FaBriefcase className="mr-1" />
                                                                Part Time
                                                            </span>
                                                        )}
                                                        {internship.applicants_count && (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                                                <FaUserFriends className="mr-1" />
                                                                {internship.applicants_count}+ applicants
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => navigateToInternship(internship.id)}
                                                            className="flex items-center gap-2 bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                        >
                                                            <FaEye className="text-sm" />
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={() => removeBookmark(bookmark.id, internship.id)}
                                                            className="flex items-center gap-2 text-red-500 hover:text-red-700 px-3 py-2 rounded-lg font-medium hover:bg-red-50 transition-all duration-200"
                                                        >
                                                            <FaTrash className="text-sm" />
                                                            Remove
                                                        </button>
                                                    </div>

                                                    {/* Posted Time */}
                                                    <p className="text-xs text-gray-400">
                                                        Posted {formatPostedTime()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CandidateBookmarks; 