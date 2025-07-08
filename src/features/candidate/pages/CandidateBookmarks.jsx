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
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import moment from 'moment';

const CandidateBookmarks = () => {
    const { t } = useTranslation();
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
            setError(t('candidateBookmarks.error'));
            toast.error(t('candidateBookmarks.error'));
        } finally {
            setLoading(false);
        }
    };

    const removeBookmark = async (bookmarkId, internshipId) => {
        try {
            await api.post(`/bookmarks/${internshipId}/`);
            setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
            toast.success(t('candidateBookmarks.removedFromBookmarks'));
        } catch (error) {
            console.error('Error removing bookmark:', error);
            toast.error(t('candidateBookmarks.failedToRemove'));
        }
    };

    const navigateToInternship = (internshipId) => {
        navigate(`/candidate/internships/${internshipId}`);
    };

    useEffect(() => {
        fetchBookmarks();
    }, [t]);

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
                                    {t('candidateBookmarks.title')}
                                </h1>
                                <p className="text-gray-600 mt-2">{t('candidateBookmarks.subtitle')}</p>
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('candidateBookmarks.loading')}</h3>
                        <p className="text-gray-500">{t('candidateBookmarks.loadingSubtitle')}</p>
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
                                    {t('candidateBookmarks.title')}
                                </h1>
                                <p className="text-gray-600 mt-2">{t('candidateBookmarks.subtitle')}</p>
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('candidateBookmarks.error')}</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-md">
                            {t('candidateBookmarks.errorSubtitle')}
                        </p>
                        <button
                            onClick={fetchBookmarks}
                            className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            {t('candidateBookmarks.tryAgain')}
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
                                {t('candidateBookmarks.title')}
                            </h1>
                            <p className="text-gray-600 mt-2">{t('candidateBookmarks.subtitle')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#00A55F] to-[#008c4f] rounded-full flex items-center justify-center">
                                <FaBookmarkSolid className="text-white text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('candidateBookmarks.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A55F] focus:border-transparent bg-white"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${filterType === 'all'
                                    ? 'bg-[#00A55F] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t('candidateBookmarks.filterAll')}
                            </button>
                            <button
                                onClick={() => setFilterType('paid')}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${filterType === 'paid'
                                    ? 'bg-[#00A55F] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t('candidateBookmarks.filterPaid')}
                            </button>
                            <button
                                onClick={() => setFilterType('unpaid')}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${filterType === 'unpaid'
                                    ? 'bg-[#00A55F] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t('candidateBookmarks.filterUnpaid')}
                            </button>
                            <button
                                onClick={() => setFilterType('remote')}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${filterType === 'remote'
                                    ? 'bg-[#00A55F] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t('candidateBookmarks.filterRemote')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredBookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6"
                        >
                            <FaBookmarkSolid className="text-gray-400 text-2xl" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('candidateBookmarks.noBookmarks')}</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-md">
                            {t('candidateBookmarks.noBookmarksSubtitle')}
                        </p>
                        <button
                            onClick={() => navigate('/candidate/internships')}
                            className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            {t('candidateBookmarks.browseInternships')}
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredBookmarks.map((bookmark) => {
                            const internship = bookmark.internshipDetails;
                            if (!internship) return null;

                            const formatStipend = () => {
                                if (internship.stipend_type === 'paid') {
                                    return internship.stipend_amount
                                        ? `${internship.stipend_amount} ${internship.stipend_currency || 'MRO'}/month`
                                        : 'Paid';
                                }
                                return 'Unpaid';
                            };

                            const formatDuration = () => {
                                if (internship.duration) {
                                    return `${internship.duration} months`;
                                }
                                return 'Flexible';
                            };

                            const formatPostedTime = () => {
                                if (internship.created_at) {
                                    return moment(internship.created_at).fromNow();
                                }
                                return 'Recently';
                            };

                            const formatStipendType = () => {
                                if (internship.stipend_type === 'paid') {
                                    return t('candidateBookmarks.paid');
                                }
                                return t('candidateBookmarks.unpaid');
                            };

                            return (
                                <motion.div
                                    key={bookmark.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Company Logo */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#00A55F] to-[#008c4f] rounded-xl flex items-center justify-center">
                                                {internship.organization?.logo ? (
                                                    <img
                                                        src={internship.organization.logo}
                                                        alt={internship.organization.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <FaBuilding className="text-white text-xl" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#00A55F] transition-colors cursor-pointer" onClick={() => navigateToInternship(internship.id)}>
                                                        {internship.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-3 font-medium">
                                                        {internship.organization?.name}
                                                    </p>

                                                    {/* Badges */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <FaMapMarkerAlt className="w-3 h-3" />
                                                            {internship.location}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <FaClock className="w-3 h-3" />
                                                            {formatDuration()}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${internship.stipend_type === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {formatStipendType()}
                                                        </span>
                                                        {internship.is_urgent && (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                <FaBolt className="w-3 h-3" />
                                                                Urgent
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Posted time */}
                                                    <p className="text-sm text-gray-500">
                                                        {t('candidateBookmarks.posted')} {formatPostedTime()}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigateToInternship(internship.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-[#00A55F] text-white rounded-lg font-medium hover:bg-[#008c4f] transition-colors"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                        {t('candidateBookmarks.viewDetails')}
                                                    </button>
                                                    <button
                                                        onClick={() => removeBookmark(bookmark.id, internship.id)}
                                                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                        {t('candidateBookmarks.removeBookmark')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateBookmarks; 