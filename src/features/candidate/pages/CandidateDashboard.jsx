import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { FaBriefcase, FaSearch, FaBookmark, FaUser, FaExclamationTriangle, FaTimes, FaFileAlt, FaChevronLeft, FaChevronRight, FaStar, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { getCandidateProfile } from '../api/candidateApi';
import api from '../../../services/api';

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [currentRecommendedSlide, setCurrentRecommendedSlide] = useState(0);
    const [currentTrendingSlide, setCurrentTrendingSlide] = useState(0);
    const [profile, setProfile] = useState(null);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [animatedPercent, setAnimatedPercent] = useState(0);
    const [bookmarksCount, setBookmarksCount] = useState(0);
    const [applicationsCount, setApplicationsCount] = useState(0);
    const [recentApplications, setRecentApplications] = useState([]);

    // Use real user
    const currentUser = user;

    useEffect(() => {
        // Fetch candidate profile from API
        const fetchProfile = async () => {
            try {
                const data = await getCandidateProfile();
                setProfile(data);
                setProfileCompletion(calculateProfileCompletion(data));
            } catch (err) {
                setProfile(currentUser);
                setProfileCompletion(calculateProfileCompletion(currentUser));
            }
        };

        // Fetch bookmarks count from API
        const fetchBookmarksCount = async () => {
            try {
                const response = await api.get('/bookmarks/count/');
                setBookmarksCount(response.data.count);
            } catch (error) {
                setBookmarksCount(0);
            }
        };

        // Fetch applications count from API
        const fetchApplicationsCount = async () => {
            try {
                const response = await api.get('/applications/candidate/count/');
                setApplicationsCount(response.data.count);
            } catch (error) {
                setApplicationsCount(0);
            }
        };

        // Fetch recent applications from API
        const fetchRecentApplications = async () => {
            try {
                const response = await api.get('/applications/candidate/recent/');
                setRecentApplications(response.data);
            } catch (error) {
                setRecentApplications([]);
            }
        };

        fetchProfile();
        fetchBookmarksCount();
        fetchApplicationsCount();
        fetchRecentApplications();
    }, []);

    // Listen for bookmark changes and refresh count
    useEffect(() => {
        const handleBookmarkChange = () => {
            fetchBookmarksCount();
        };
        window.addEventListener('bookmarkChanged', handleBookmarkChange);
        return () => window.removeEventListener('bookmarkChanged', handleBookmarkChange);
    }, []);

    function calculateProfileCompletion(profile) {
        if (!profile) return 0;
        let completed = 0;
        const total = 10;
        if (profile.first_name) completed++;
        if (profile.last_name) completed++;
        if (profile.phone) completed++;
        if (profile.city) completed++;
        if (profile.university) completed++;
        if (profile.graduation_year) completed++;
        if (profile.degree) completed++;
        if (profile.profile_picture) completed++;
        if (profile.resume) completed++;
        if (Array.isArray(profile.skills) && profile.skills.length >= 3) completed++;
        return Math.round((completed / total) * 100);
    }

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A55F] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Helper for status badge color
    const statusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back, {currentUser?.first_name || 'Student'} 👋</h1>
                    <p className="text-gray-600">It's help you land your dream career</p>
                </motion.div>

                {/* Statistics Cards - Responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Applications</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{applicationsCount}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0 ml-3">
                                <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Profile Completion Card - Pro UI */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,165,95,0.12)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                        className="relative bg-gradient-to-br from-green-100 via-white to-green-50 rounded-xl shadow-sm border border-green-200 p-4 sm:p-6 overflow-hidden cursor-pointer"
                        onMouseEnter={() => setShowProfilePopup(true)}
                        onMouseLeave={() => setShowProfilePopup(false)}
                    >
                        {/* Decorative background circle */}
                        <div className="absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-green-200 opacity-30 rounded-full z-0"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-green-700">Profile Completion</p>
                                <motion.p
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 }}
                                    className="text-xl sm:text-2xl font-bold text-green-900"
                                >
                                    {animatedPercent}%
                                </motion.p>
                            </div>
                            <div className="p-2 sm:p-3 bg-green-200 rounded-lg flex-shrink-0 ml-3">
                                <FaStar className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
                            </div>
                        </div>
                        {/* Pro-style popup on hover */}
                        <AnimatePresence>
                            {showProfilePopup && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white border border-green-200 shadow-lg rounded-lg p-4 z-20"
                                >
                                    <p className="text-green-800 font-semibold mb-1">Complete your profile to increase your chances of getting hired!</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-700 font-bold text-lg">{profileCompletion}%</span>
                                        <span className="text-xs text-gray-500">completed</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Saved Jobs</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{bookmarksCount}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg flex-shrink-0 ml-3">
                                <FaBookmark className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                            </div>
                        </div>
                    </motion.div>


                </div>

                {/* Quick Actions - Responsive grid, stack on mobile */}
                {/* The quick action cards for 'Find Internships', 'Find Jobs', and 'My Profile' have been removed as requested. */}

                {/* Recent Applications - Responsive, ensure no overflow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                        <button onClick={() => navigate('/candidate/applications')} className="text-sm text-[#00A55F] hover:text-[#008c4f] font-medium">View All</button>
                    </div>
                    <div className="p-4 sm:p-6">
                        {recentApplications.length > 0 ? (
                            <div className="space-y-4">
                                {recentApplications.map((application, index) => (
                                    <motion.div
                                        key={application.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <img
                                            src={application.candidate_photo ? (application.candidate_photo.startsWith('http') ? application.candidate_photo : `${import.meta.env.VITE_MEDIA_BASE_URL}${application.candidate_photo}`) : '/default-logo.png'}
                                            alt={application.candidate_name}
                                            className="w-10 h-10 rounded-lg object-cover mb-2 sm:mb-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">{application.candidate_name}</h3>
                                            <p className="text-sm text-gray-600 truncate">{application.candidate_email}</p>
                                            <p className="text-xs text-gray-500">Applied on {new Date(application.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(application.status)}`}>
                                                {application.status}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <FaBookmark className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No applications yet</p>
                                <p className="text-sm">Start applying to internships and jobs to see your applications here</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default CandidateDashboard; 