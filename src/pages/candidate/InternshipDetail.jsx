import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaClock,
    FaBuilding,
    FaCalendarAlt,
    FaArrowLeft,
    FaCheckCircle,
    FaStar,
    FaUsers,
    FaCertificate,
    FaHandshake,
    FaLaptop,
    FaGraduationCap,
    FaShare,
    FaBookmark,
    FaExternalLinkAlt,
    FaGlobe,
    FaCalendar,
    FaUserTie,
    FaBriefcase,
    FaCheckDouble,
    FaFacebook,
    FaWhatsapp,
    FaTwitter,
    FaLinkedin,
    FaTelegram,
    FaLink,
    FaTimes,
    FaSyncAlt
} from 'react-icons/fa';
import { MdWorkOutline, MdLocationOn, MdAccessTime, MdBusiness } from 'react-icons/md';
import { BsShare, BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';
import moment from 'moment';
import toast from 'react-hot-toast';
import { getInternshipDetail, applyToInternship } from '@/services/internshipApi';
import { useAuth } from '@/context/AuthContext';
import SkillBadge from '@/components/ui/SkillBadge';
import AuthModal from '@/components/ui/AuthModal';
import api from '@/services/api';
import VerifiedBadge from '@/components/VerifiedBadge';
import ApplyModal from '@/features/candidate/components/ApplyModal';

const fallbackLogo = 'https://ui-avatars.com/api/?name=Stage222&background=00A55F&color=fff&rounded=true';

// Share Menu Component
const ShareMenu = ({ isOpen, onClose, url, title }) => {
    const [copied, setCopied] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const shareData = {
        url: url || window.location.href,
        title: title || 'Check out this internship on Stage222'
    };

    const shareOptions = [
        {
            name: 'Facebook',
            icon: FaFacebook,
            color: 'from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            shadowColor: 'shadow-blue-500/25',
            description: 'Share with friends and family on Facebook',
            action: () => {
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
                window.open(facebookUrl, '_blank', 'width=600,height=400');
            }
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            color: 'from-green-500 to-green-600',
            hoverColor: 'hover:from-green-600 hover:to-green-700',
            shadowColor: 'shadow-green-500/25',
            description: 'Share via WhatsApp message or group',
            action: () => {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.title} - ${shareData.url}`)}`;
                window.open(whatsappUrl, '_blank');
            }
        },
        {
            name: 'Copy Link',
            icon: FaLink,
            color: 'from-gray-500 to-gray-600',
            hoverColor: 'hover:from-gray-600 hover:to-gray-700',
            shadowColor: 'shadow-gray-500/25',
            description: 'Copy the link to your clipboard',
            action: async () => {
                try {
                    await navigator.clipboard.writeText(shareData.url);
                    setCopied(true);
                    toast.success('Link copied to clipboard!');
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    toast.error('Failed to copy link');
                }
            }
        }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    ref={menuRef}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#00A55F] to-emerald-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <FaShare className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Share Internship</h2>
                                    <p className="text-white/80 text-sm">Choose your preferred sharing method</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <FaTimes className="text-xl" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Share Options */}
                    <div className="p-6">
                        <div className="space-y-4">
                            {shareOptions.map((option, index) => (
                                <motion.div
                                    key={option.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
                                >
                                    <motion.button
                                        whileHover={{
                                            scale: 1.01,
                                            y: -1,
                                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                                        }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={option.action}
                                        className={`
                                            w-full group relative overflow-hidden rounded-2xl p-5 text-left
                                            bg-gradient-to-r ${option.color} ${option.hoverColor}
                                            transition-all duration-300 ease-out
                                            shadow-lg ${option.shadowColor}
                                            border border-white/20
                                            h-20
                                        `}
                                    >
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Content */}
                                        <div className="relative flex items-center gap-4 h-full">
                                            {/* Icon Container */}
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0"
                                            >
                                                <option.icon className="text-2xl text-white" />
                                            </motion.div>

                                            {/* Text Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-white text-lg truncate">
                                                        {option.name}
                                                    </h3>
                                                    {copied && option.name === 'Copy Link' && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0"
                                                        >
                                                            <FaCheckCircle className="text-green-600 text-xs" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <p className="text-white/80 text-sm font-medium truncate">
                                                    {copied && option.name === 'Copy Link' ? 'Link copied successfully!' : option.description}
                                                </p>
                                            </div>

                                            {/* Arrow Icon */}
                                            <motion.div
                                                initial={{ x: 0 }}
                                                whileHover={{ x: 5 }}
                                                className="text-white/60 group-hover:text-white transition-colors flex-shrink-0"
                                            >
                                                <FaExternalLinkAlt className="text-lg" />
                                            </motion.div>
                                        </div>

                                        {/* Hover Effect */}
                                        <motion.div
                                            className="absolute inset-0 bg-white/5 rounded-2xl"
                                            initial={{ scale: 0 }}
                                            whileHover={{ scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>

                        {/* URL Display */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-200"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <FaLink className="text-[#00A55F] text-sm" />
                                <span className="text-sm font-semibold text-gray-700">Share this link:</span>
                            </div>
                            <div className="relative">
                                <p className="text-sm text-gray-600 break-all font-mono bg-white p-2 rounded-lg border">
                                    {shareData.url}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(shareData.url);
                                        toast.success('URL copied!');
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-[#00A55F] text-white rounded hover:bg-[#008c4f] transition-colors"
                                    title="Copy URL"
                                >
                                    <FaLink className="text-xs" />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Footer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4 text-center"
                        >
                            <p className="text-xs text-gray-500">
                                Share this amazing opportunity with your network!
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const InternshipDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [internship, setInternship] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orgLoading, setOrgLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const applyButtonRef = useRef(null);
    const [applyModalOpen, setApplyModalOpen] = useState(false);

    const fetchInternship = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getInternshipDetail(id);
            const isUpdate = internship && JSON.stringify(response.data) !== JSON.stringify(internship);
            setInternship(response.data);
            setLastUpdated(new Date());

            // Fetch complete organization details if organization exists
            if (response.data.organization && response.data.organization.id) {
                setOrgLoading(true);
                try {
                    const orgResponse = await api.get(`/organizations/${response.data.organization.id}/`);
                    const orgData = orgResponse.data.data || orgResponse.data;

                    // Get recruiter ID from the internship
                    const recruiterId = response.data.recruiter || response.data.recruiter_id;

                    if (recruiterId) {
                        try {
                            // Use the same dashboard API that the recruiter dashboard uses
                            let opportunitiesCount = 0;
                            let recruiterData = {};

                            try {
                                // If the authenticated user is a recruiter, get their dashboard data
                                if (user && user.role === 'recruiter') {
                                    const dashboardResponse = await api.get('/recruiters/dashboard/');
                                    const dashboardData = dashboardResponse.data;
                                    opportunitiesCount = dashboardData.total_opportunities || 0;

                                    // Use dashboard data for other metrics too
                                    recruiterData = {
                                        total_hires: dashboardData.total_hires || 0,
                                        avg_response_time: dashboardData.avg_response_time || '24h',
                                        avg_application_time: dashboardData.avg_application_review_time || '2.3',
                                        repeat_hires: dashboardData.repeat_candidates || 0
                                    };
                                } else {
                                    // For non-recruiters, get opportunities by the specific recruiter who posted this internship
                                    const opportunitiesResponse = await api.get(`/internships/?recruiter=${recruiterId}&limit=100`);
                                    const opportunitiesData = opportunitiesResponse.data;

                                    // Count only opportunities by this specific recruiter
                                    if (opportunitiesData.results) {
                                        opportunitiesCount = opportunitiesData.results.filter(opp =>
                                            opp.recruiter === recruiterId ||
                                            opp.recruiter_id === recruiterId ||
                                            opp.user === recruiterId
                                        ).length;
                                    } else if (Array.isArray(opportunitiesData)) {
                                        opportunitiesCount = opportunitiesData.filter(opp =>
                                            opp.recruiter === recruiterId ||
                                            opp.recruiter_id === recruiterId ||
                                            opp.user === recruiterId
                                        ).length;
                                    } else {
                                        opportunitiesCount = opportunitiesData.count || 0;
                                    }
                                }
                            } catch (oppError) {
                                console.warn('Auto-refresh: Could not fetch opportunities data:', oppError);
                                // Fallback to basic data
                                opportunitiesCount = 0;
                            }

                            // Merge organization data with recruiter metrics
                            const enhancedOrgData = {
                                ...orgData,
                                total_opportunities_posted: opportunitiesCount,
                                total_hires: recruiterData.total_hires || 0,
                                avg_response_time: recruiterData.avg_response_time || '24h',
                                avg_application_time: recruiterData.avg_application_review_time || '2.3',
                                repeat_hires: recruiterData.repeat_candidates || 0,
                                is_verified: orgData.is_verified || false,
                                recruiter_id: recruiterId
                            };

                            setOrganization(enhancedOrgData);
                        } catch (recruiterError) {
                            console.error('Auto-refresh: Error fetching recruiter data:', recruiterError);
                            setOrganization({
                                ...orgData,
                                recruiter_id: recruiterId
                            });
                        }
                    } else {
                        setOrganization(orgData);
                    }
                } catch (orgError) {
                    console.error('Error fetching organization details:', orgError);
                    // Fallback to basic organization data from internship
                    setOrganization(response.data.organization || {});
                } finally {
                    setOrgLoading(false);
                }
            } else {
                setOrganization(response.data.organization || {});
            }

            // Check if internship is saved (from localStorage for now)
            const savedInternships = JSON.parse(localStorage.getItem('savedInternships') || '[]');
            setIsSaved(savedInternships.includes(id));

            // Show notification for auto-refresh updates
            if (isUpdate && !isRefreshing) {
                toast.success('Internship status updated!', {
                    duration: 3000,
                    icon: '🔄'
                });
            }
        } catch (err) {
            console.error('Error fetching internship:', err);
            setError('Failed to load internship details.');
            toast.error('Failed to load internship details.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchInternship();
        setIsRefreshing(false);
        toast.success('Internship data refreshed!');
    };

    useEffect(() => {
        if (id) {
            fetchInternship();
        }
    }, [id]);

    // Debug: Log organization data changes
    useEffect(() => {
        if (organization) {
            console.log('Organization data updated:', organization);
            console.log('Total opportunities posted:', organization.total_opportunities_posted);
        }
    }, [organization]);

    // Auto-refresh every 30 seconds to check for status changes
    useEffect(() => {
        if (!id) return;

        const interval = setInterval(async () => {
            try {
                const response = await getInternshipDetail(id);
                // Only update if there are actual changes
                if (JSON.stringify(response.data) !== JSON.stringify(internship)) {
                    setInternship(response.data);

                    // Also refresh organization details
                    if (response.data.organization && response.data.organization.id) {
                        try {
                            const orgResponse = await api.get(`/organizations/${response.data.organization.id}/`);
                            const orgData = orgResponse.data.data || orgResponse.data;

                            // Get recruiter ID from the internship
                            const recruiterId = response.data.recruiter || response.data.recruiter_id;

                            if (recruiterId) {
                                try {
                                    // Use the same dashboard API that the recruiter dashboard uses
                                    let opportunitiesCount = 0;
                                    let recruiterData = {};

                                    try {
                                        // If the authenticated user is a recruiter, get their dashboard data
                                        if (user && user.role === 'recruiter') {
                                            const dashboardResponse = await api.get('/recruiters/dashboard/');
                                            const dashboardData = dashboardResponse.data;
                                            opportunitiesCount = dashboardData.total_opportunities || 0;

                                            // Use dashboard data for other metrics too
                                            recruiterData = {
                                                total_hires: dashboardData.total_hires || 0,
                                                avg_response_time: dashboardData.avg_response_time || '24h',
                                                avg_application_time: dashboardData.avg_application_review_time || '2.3',
                                                repeat_hires: dashboardData.repeat_candidates || 0
                                            };
                                        } else {
                                            // For non-recruiters, get opportunities by the specific recruiter who posted this internship
                                            const opportunitiesResponse = await api.get(`/internships/?recruiter=${recruiterId}&limit=100`);
                                            const opportunitiesData = opportunitiesResponse.data;

                                            // Count only opportunities by this specific recruiter
                                            if (opportunitiesData.results) {
                                                opportunitiesCount = opportunitiesData.results.filter(opp =>
                                                    opp.recruiter === recruiterId ||
                                                    opp.recruiter_id === recruiterId ||
                                                    opp.user === recruiterId
                                                ).length;
                                            } else if (Array.isArray(opportunitiesData)) {
                                                opportunitiesCount = opportunitiesData.filter(opp =>
                                                    opp.recruiter === recruiterId ||
                                                    opp.recruiter_id === recruiterId ||
                                                    opp.user === recruiterId
                                                ).length;
                                            } else {
                                                opportunitiesCount = opportunitiesData.count || 0;
                                            }
                                        }
                                    } catch (oppError) {
                                        console.warn('Auto-refresh: Could not fetch opportunities data:', oppError);
                                        // Fallback to basic data
                                        opportunitiesCount = 0;
                                    }

                                    // Merge organization data with recruiter metrics
                                    const enhancedOrgData = {
                                        ...orgData,
                                        total_opportunities_posted: opportunitiesCount,
                                        total_hires: recruiterData.total_hires || 0,
                                        avg_response_time: recruiterData.avg_response_time || '24h',
                                        avg_application_time: recruiterData.avg_application_review_time || '2.3',
                                        repeat_hires: recruiterData.repeat_candidates || 0,
                                        is_verified: orgData.is_verified || false,
                                        recruiter_id: recruiterId
                                    };

                                    setOrganization(enhancedOrgData);
                                } catch (recruiterError) {
                                    console.error('Auto-refresh: Error fetching recruiter data:', recruiterError);
                                    setOrganization({
                                        ...orgData,
                                        recruiter_id: recruiterId
                                    });
                                }
                            } else {
                                setOrganization(orgData);
                            }
                        } catch (orgError) {
                            console.error('Auto-refresh: Error fetching organization details:', orgError);
                            setOrganization(response.data.organization || {});
                        }
                    } else {
                        setOrganization(response.data.organization || {});
                    }
                }
            } catch (err) {
                console.error('Auto-refresh error:', err);
            }
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [id, internship]);

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

    const formatDeadline = () => {
        if (!internship?.deadline) return '';
        return moment(internship.deadline).format('MMMM DD, YYYY');
    };

    const formatPostedTime = () => {
        if (!internship?.created_at) return '';
        return moment(internship.created_at).fromNow();
    };

    const isActivelyHiring = internship?.approval_status === 'approved';

    const handleShare = () => {
        setShowShareMenu(true);
    };

    const handleSave = () => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        const savedInternships = JSON.parse(localStorage.getItem('savedInternships') || '[]');

        if (isSaved) {
            const updated = savedInternships.filter(id => id !== internship.id);
            localStorage.setItem('savedInternships', JSON.stringify(updated));
            setIsSaved(false);
            toast.success('Removed from saved internships');
        } else {
            savedInternships.push(internship.id);
            localStorage.setItem('savedInternships', JSON.stringify(savedInternships));
            setIsSaved(true);
            toast.success('Saved to your internships');
        }
    };

    const handleApply = async () => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        if (user?.role !== 'candidate') {
            toast.error('Only candidates can apply for internships');
            return;
        }

        setIsApplying(true);
        try {
            await applyToInternship(internship.id, {});
            toast.success('Application submitted successfully!');
            // You could redirect to application status page or show success modal
        } catch (err) {
            console.error('Application error:', err);
            toast.error(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setIsApplying(false);
        }
    };

    const scrollToApply = () => {
        applyButtonRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Loading Shimmer */}
                <div className="animate-pulse">
                    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                        <div className="max-w-4xl mx-auto px-4 py-4">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !internship) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Internship Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'The internship you are looking for does not exist.'}</p>
                        <button
                            onClick={() => navigate('/internships')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors"
                        >
                            <FaArrowLeft />
                            Back to Internships
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const logoUrl = organization?.logo
        ? (organization.logo.startsWith('http')
            ? organization.logo
            : `${import.meta.env.VITE_MEDIA_BASE_URL}${organization.logo}`)
        : fallbackLogo;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky Header */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm"
            >
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/internships')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FaArrowLeft className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                    {internship.title}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {orgLoading ? (
                                        <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            {organization?.name}
                                            {organization?.is_verified && <VerifiedBadge />}
                                        </span>
                                    )}
                                </p>
                                {lastUpdated && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Last updated: {moment(lastUpdated).fromNow()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Refresh data"
                            >
                                <motion.div
                                    animate={{ rotate: isRefreshing ? 360 : 0 }}
                                    transition={{
                                        duration: 1,
                                        repeat: isRefreshing ? Infinity : 0,
                                        ease: "linear"
                                    }}
                                >
                                    <FaSyncAlt className={`text-gray-600 ${isRefreshing ? 'text-[#00A55F]' : ''}`} />
                                </motion.div>
                            </motion.button>
                            <button
                                onClick={handleShare}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Share"
                            >
                                <BsShare className="text-gray-600" />
                            </button>
                            <button
                                onClick={handleSave}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title={isSaved ? "Remove from saved" : "Save internship"}
                            >
                                {isSaved ? (
                                    <BsBookmarkFill className="text-[#00A55F]" />
                                ) : (
                                    <BsBookmark className="text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Status Banner */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, type: "spring", damping: 20 }}
                    className={`mb-6 rounded-2xl p-4 shadow-lg border-2 ${internship.status === 'closed'
                        ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 border-red-400'
                        : 'bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 border-green-400'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${internship.status === 'closed'
                                    ? 'bg-red-400'
                                    : 'bg-green-400'
                                    }`}
                            >
                                {internship.status === 'closed' ? (
                                    <FaTimes className="text-white text-xl" />
                                ) : (
                                    <FaCheckCircle className="text-white text-xl" />
                                )}
                            </motion.div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {internship.status === 'closed' ? 'Applications Closed' : 'Applications Open'}
                                </h2>
                                <p className="text-white/90 text-sm">
                                    {internship.status === 'closed'
                                        ? 'This position is no longer accepting applications'
                                        : 'Apply now before the deadline'
                                    }
                                </p>
                            </div>
                        </div>
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={`px-6 py-3 rounded-full font-bold text-lg tracking-wider shadow-lg ${internship.status === 'closed'
                                ? 'bg-red-400 text-white'
                                : 'bg-green-400 text-white'
                                }`}
                        >
                            {internship.status === 'closed' ? 'CLOSED' : 'OPEN'}
                        </motion.div>
                    </div>

                    {/* Progress Bar for Open Applications */}
                    {internship.status !== 'closed' && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden"
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.5, delay: 1 }}
                                className="h-full bg-white rounded-full shadow-lg"
                            />
                        </motion.div>
                    )}
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Top Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Organization Logo */}
                            <div className="flex-shrink-0">
                                <img
                                    src={logoUrl}
                                    alt={organization?.name || 'Organization'}
                                    className="w-20 h-20 object-contain rounded-xl border border-gray-200"
                                    onError={e => (e.target.src = fallbackLogo)}
                                />
                            </div>

                            {/* Main Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                            {internship.title}
                                        </h1>
                                        <div className="flex items-center gap-2 mb-3">
                                            <FaBuilding className="text-gray-400" />
                                            <span className="text-lg font-semibold text-gray-700">
                                                {orgLoading ? (
                                                    <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        {organization?.name}
                                                        {organization?.is_verified && <VerifiedBadge />}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {isActivelyHiring && (
                                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-[#00A55F] border border-green-200">
                                            Actively hiring
                                        </span>
                                    )}
                                    {/* Status Badge */}
                                    <div className="flex flex-col gap-2">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3, type: "spring", damping: 15, stiffness: 300 }}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-md border ${internship.status === 'closed'
                                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-red-200/50'
                                                : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-green-400 shadow-green-200/50'
                                                }`}
                                        >
                                            {/* Animated Pulse Dot */}
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [0.8, 1, 0.8]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className={`w-1.5 h-1.5 rounded-full ${internship.status === 'closed'
                                                    ? 'bg-red-200'
                                                    : 'bg-green-200'
                                                    }`}
                                            />
                                            <span>
                                                {internship.status === 'closed' ? 'CLOSED' : 'OPEN'}
                                            </span>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Key Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MdLocationOn className="text-[#00A55F]" />
                                        <span>{internship.location || 'Remote'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MdAccessTime className="text-[#00A55F]" />
                                        <span>{formatDuration()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaMoneyBillWave className="text-[#00A55F]" />
                                        <span>{formatStipend()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaCalendarAlt className="text-[#00A55F]" />
                                        <span>Apply by {formatDeadline()}</span>
                                    </div>
                                </div>

                                {/* Meta Info with Number of Applicants */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span>Posted {formatPostedTime()}</span>
                                    {/* Enhanced Number of Applicants Display */}
                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                                        <FaUsers className="text-[#00A55F] text-sm" />
                                        <span className="font-medium text-blue-700">
                                            {internship.applicants_count || 0} applicants
                                        </span>
                                    </div>
                                    {internship.job_offer_max && (
                                        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
                                            Job offer up to MRU {internship.job_offer_max}
                                        </span>
                                    )}
                                </div>

                                {/* Organization Website - Prominent Display */}
                                {organization.website && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#00A55F] rounded-full flex items-center justify-center">
                                                    <FaGlobe className="text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Company Website</h4>
                                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                                        {organization?.name}
                                                        {organization?.is_verified && <VerifiedBadge size={16} />}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={organization.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors text-sm font-medium"
                                            >
                                                Visit Website
                                                <FaExternalLinkAlt className="text-xs" />
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Apply Button */}
                                <motion.button
                                    whileHover={{ scale: internship.status !== 'closed' ? 1.02 : 1 }}
                                    whileTap={{ scale: internship.status !== 'closed' ? 0.98 : 1 }}
                                    onClick={() => setApplyModalOpen(true)}
                                    disabled={isApplying || internship.status === 'closed'}
                                    className={`relative px-8 py-4 font-bold rounded-xl transition-all duration-300 shadow-lg border-2 ${internship.status === 'closed'
                                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed border-gray-300'
                                        : 'bg-gradient-to-r from-[#00A55F] to-emerald-600 text-white hover:from-emerald-600 hover:to-[#00A55F] border-emerald-400 hover:shadow-xl hover:shadow-emerald-200/50 disabled:opacity-70 disabled:cursor-not-allowed'
                                        }`}
                                >
                                    {/* Button Glow Effect */}
                                    {internship.status !== 'closed' && (
                                        <motion.div
                                            animate={{
                                                opacity: [0.3, 0.6, 0.3],
                                                scale: [1, 1.05, 1]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 blur-sm"
                                        />
                                    )}

                                    <div className="relative flex items-center justify-center gap-2">
                                        {isApplying ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                />
                                                <span>Applying...</span>
                                            </>
                                        ) : internship.status === 'closed' ? (
                                            <>
                                                <FaTimes className="text-lg" />
                                                <span>Applications Closed</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaHandshake className="text-lg" />
                                                <span>Apply Now</span>
                                            </>
                                        )}
                                    </div>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Prominent Applicants Counter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`rounded-2xl shadow-sm border p-6 mb-6 ${internship.status === 'closed'
                            ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${internship.status === 'closed' ? 'bg-red-500' : 'bg-[#00A55F]'
                                        }`}
                                >
                                    <FaUsers className="text-white text-xl" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Total Applicants</h3>
                                    <p className="text-sm text-gray-600">
                                        {internship.status === 'closed'
                                            ? 'Applications are now closed for this position'
                                            : 'See how many people are interested in this position'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.4, type: "spring", damping: 15 }}
                                    className={`text-4xl font-bold ${internship.status === 'closed' ? 'text-red-600' : 'text-[#00A55F]'
                                        }`}
                                >
                                    {internship.applicants_count || 0}
                                </motion.div>
                                <p className="text-sm text-gray-600 mb-2">applicants</p>

                                {/* Application Rate Indicator */}
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <div className={`w-2 h-2 rounded-full ${internship.applicants_count > 10 ? 'bg-green-500' :
                                        internship.applicants_count > 5 ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`} />
                                    <span>
                                        {internship.applicants_count > 10 ? 'High Interest' :
                                            internship.applicants_count > 5 ? 'Moderate Interest' : 'New Listing'}
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3, type: "spring", damping: 15, stiffness: 300 }}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-md border mt-2 ${internship.status === 'closed'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-red-200/50'
                                        : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-green-400 shadow-green-200/50'
                                        }`}
                                >
                                    {/* Animated Pulse Dot */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.8, 1, 0.8]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className={`w-1.5 h-1.5 rounded-full ${internship.status === 'closed'
                                            ? 'bg-red-200'
                                            : 'bg-green-200'
                                            }`}
                                    />
                                    <span>
                                        {internship.status === 'closed' ? 'CLOSED' : 'OPEN'}
                                    </span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Application Status */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Application Deadline:</span>
                                    <span className="font-medium text-gray-900">{formatDeadline()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Positions Available:</span>
                                    <span className="font-medium text-gray-900">{internship.openings || 1} position(s)</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Competition Level:</span>
                                    <span className={`font-medium ${internship.applicants_count > 10 ? 'text-red-600' :
                                        internship.applicants_count > 5 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                        {internship.applicants_count > 10 ? 'High' :
                                            internship.applicants_count > 5 ? 'Medium' : 'Low'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About the Internship */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <MdWorkOutline className="text-[#00A55F]" />
                                    About the Internship
                                </h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {internship.description}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Skills Required */}
                            {internship.skills && internship.skills.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                                >
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaGraduationCap className="text-[#00A55F]" />
                                        Skills Required
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {internship.skills.map((skill, index) => (
                                            <SkillBadge key={index} skill={skill} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Preferences - Soft Colored Section */}
                            {internship.preferences && internship.preferences.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-purple-200 p-6"
                                >
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaStar className="text-purple-600" />
                                        Ideal Skills & Preferences
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        {internship.preferences.map((preference, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-purple-100">
                                                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <FaCheckCircle className="text-purple-600 text-xs" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{preference}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Responsibilities */}
                            {internship.responsibilities && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                                >
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaBriefcase className="text-[#00A55F]" />
                                        Responsibilities
                                    </h2>
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {internship.responsibilities}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Who Can Apply */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaUsers className="text-[#00A55F]" />
                                    Who Can Apply
                                </h2>
                                <ul className="space-y-3">
                                    {internship.eligibility_rules ? (
                                        internship.eligibility_rules.map((rule, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-700">
                                                <FaCheckCircle className="text-[#00A55F] mt-0.5 flex-shrink-0" />
                                                <span>{rule}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="flex items-start gap-3 text-gray-700">
                                            <FaCheckCircle className="text-[#00A55F] mt-0.5 flex-shrink-0" />
                                            <span>Open to all eligible candidates</span>
                                        </li>
                                    )}
                                </ul>
                            </motion.div>

                            {/* Other Requirements */}
                            {internship.other_requirements && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                                >
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaCheckDouble className="text-[#00A55F]" />
                                        Other Requirements
                                    </h2>
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-700 leading-relaxed">
                                            {internship.other_requirements}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Perks */}
                            {internship.perks && internship.perks.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaStar className="text-[#00A55F]" />
                                        Perks
                                    </h3>
                                    <div className="space-y-2">
                                        {internship.perks.map((perk, index) => (
                                            <div key={index} className="flex items-center gap-2 text-gray-700">
                                                <FaCheckCircle className="text-[#00A55F] text-sm" />
                                                <span className="text-sm">{perk}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Number of Openings */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaUsers className="text-[#00A55F]" />
                                    Openings
                                </h3>
                                <div className="text-2xl font-bold text-[#00A55F]">
                                    {internship.openings || 1}
                                </div>
                                <p className="text-sm text-gray-600">positions available</p>
                            </motion.div>

                            {/* About the Organization - Enhanced Professional Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaBuilding className="text-[#00A55F]" />
                                    About {organization?.name}
                                    {organization?.is_verified && <VerifiedBadge />}
                                </h3>

                                {/* Company Description */}
                                {organization?.about && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {organization.about}
                                        </p>
                                    </div>
                                )}

                                {/* Company Information Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    {/* Company Size */}
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FaUsers className="text-blue-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Company Size</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {orgLoading ? (
                                                    <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                                                ) : (
                                                    organization?.employee_range || organization?.employee_count || 'Not specified'
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Industry */}
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <FaBriefcase className="text-purple-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Industry</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {orgLoading ? (
                                                    <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                                                ) : (
                                                    organization?.industry || 'Not specified'
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <FaMapMarkerAlt className="text-green-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Location</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {orgLoading ? (
                                                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                                                ) : (
                                                    organization?.city || 'Remote'
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Founded */}
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                            <FaCalendar className="text-orange-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Founded</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {orgLoading ? (
                                                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                                                ) : (
                                                    organization?.founded_year || 'Not specified'
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Website - Enhanced */}
                                {organization?.website && (
                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FaGlobe className="text-[#00A55F]" />
                                                <span className="text-sm font-medium text-gray-700">Official Website</span>
                                            </div>
                                            <a
                                                href={organization.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors text-xs font-medium"
                                            >
                                                Visit Site
                                                <FaExternalLinkAlt className="text-xs" />
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Company Highlights */}
                                <div className="mt-4 pt-4 border-t">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Why Work With Us</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FaCheckCircle className="text-[#00A55F] text-xs" />
                                            <span>Professional growth opportunities</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FaCheckCircle className="text-[#00A55F] text-xs" />
                                            <span>Collaborative work environment</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FaCheckCircle className="text-[#00A55F] text-xs" />
                                            <span>Innovative projects and technologies</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FaCheckCircle className="text-[#00A55F] text-xs" />
                                            <span>Mentorship and learning programs</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Job Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Job Details</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Job Type:</span>
                                        <span className="font-medium capitalize">{internship.job_type || 'Full-time'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Location:</span>
                                        <span className="font-medium">{internship.type === 'remote' ? 'Remote' : internship.location}</span>
                                    </div>
                                    {internship.start_date && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Start Date:</span>
                                            <span className="font-medium">{moment(internship.start_date).format('MMM DD, YYYY')}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Screening Questions Section */}
                    {internship.screening_questions && internship.screening_questions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl shadow-sm border border-orange-200 p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FaGraduationCap className="text-orange-600" />
                                Screening Questions
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Be prepared to answer these questions during your application process
                            </p>
                            <div className="space-y-4">
                                {internship.screening_questions.map((question, index) => (
                                    <div key={index} className="bg-white/70 rounded-lg p-4 border border-orange-100">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-orange-600 text-xs font-bold">{index + 1}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-medium mb-2">{question}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                                        Required
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-blue-600 text-sm" />
                                    <p className="text-sm text-blue-800">
                                        <strong>Tip:</strong> Prepare thoughtful answers to these questions to increase your chances of being selected.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Bottom Apply Section */}
                    <motion.div
                        ref={applyButtonRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Apply?</h3>
                            <p className="text-gray-600 mb-6">Take the first step towards your dream internship</p>
                            <motion.button
                                whileHover={{ scale: internship.status !== 'closed' ? 1.02 : 1 }}
                                whileTap={{ scale: internship.status !== 'closed' ? 0.98 : 1 }}
                                onClick={() => setApplyModalOpen(true)}
                                disabled={isApplying || internship.status === 'closed'}
                                className={`relative px-8 py-4 font-bold rounded-xl transition-all duration-300 shadow-lg border-2 ${internship.status === 'closed'
                                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed border-gray-300'
                                    : 'bg-gradient-to-r from-[#00A55F] to-emerald-600 text-white hover:from-emerald-600 hover:to-[#00A55F] border-emerald-400 hover:shadow-xl hover:shadow-emerald-200/50 disabled:opacity-70 disabled:cursor-not-allowed'
                                    }`}
                            >
                                {/* Button Glow Effect */}
                                {internship.status !== 'closed' && (
                                    <motion.div
                                        animate={{
                                            opacity: [0.3, 0.6, 0.3],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 blur-sm"
                                    />
                                )}

                                <div className="relative flex items-center justify-center gap-2">
                                    {isApplying ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            <span>Applying...</span>
                                        </>
                                    ) : internship.status === 'closed' ? (
                                        <>
                                            <FaTimes className="text-lg" />
                                            <span>Applications Closed</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaHandshake className="text-lg" />
                                            <span>Apply Now</span>
                                        </>
                                    )}
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Organization Activity Section - Redesigned */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8 bg-gradient-to-br from-[#00A55F]/5 via-emerald-50 to-green-50 rounded-2xl shadow-sm border border-[#00A55F]/20 p-8"
                    >
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                                <div className="w-10 h-10 bg-[#00A55F] rounded-full flex items-center justify-center">
                                    <MdBusiness className="text-white text-xl" />
                                </div>
                                Organization Activity
                            </h3>
                            <p className="text-gray-600">Discover the company's hiring activity and success metrics</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Hiring Since */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8, type: "spring", damping: 20 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <FaCalendar className="text-white text-xl" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {organization?.created_at ?
                                            moment(organization.created_at).format('MMM YYYY') :
                                            moment(internship.created_at).format('MMM YYYY')
                                        }
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">Joined Platform</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        {organization?.created_at ?
                                            `${moment().diff(moment(organization.created_at), 'months')} months ago` :
                                            `${moment().diff(moment(internship.created_at), 'months')} months ago`
                                        }
                                    </div>
                                </div>
                            </motion.div>

                            {/* Opportunities Posted */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.9, type: "spring", damping: 20 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer"
                                onClick={() => {
                                    const recruiterId = internship.recruiter || internship.recruiter_id || organization?.recruiter_id;
                                    if (recruiterId) {
                                        navigate(`/recruiter/${recruiterId}/opportunities`);
                                    } else {
                                        toast.error('Recruiter information not available');
                                    }
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <FaBriefcase className="text-white text-xl" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {(() => {
                                            // Use the same dashboard data source as the recruiter dashboard
                                            if (user && user.role === 'recruiter') {
                                                // For authenticated recruiters, use dashboard data
                                                return organization?.total_opportunities_posted || 0;
                                            } else {
                                                // For non-recruiters, show the data we already fetched
                                                return organization?.total_opportunities_posted || 0;
                                            }
                                        })()}
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">Opportunities Posted</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        {(() => {
                                            const count = (() => {
                                                // Use the same dashboard data source as the recruiter dashboard
                                                if (user && user.role === 'recruiter') {
                                                    // For authenticated recruiters, use dashboard data
                                                    return organization?.total_opportunities_posted || 0;
                                                } else {
                                                    // For non-recruiters, show the data we already fetched
                                                    return organization?.total_opportunities_posted || 0;
                                                }
                                            })();

                                            if (count > 10) return 'Very Active';
                                            if (count > 5) return 'Active';
                                            if (count > 0) return 'Getting Started';
                                            return 'No opportunities yet';
                                        })()}
                                    </div>
                                    <div className="mt-3 text-xs text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Click to view all opportunities →
                                    </div>
                                </div>
                            </motion.div>

                            {/* Candidates Hired */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1.0, type: "spring", damping: 20 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <FaHandshake className="text-white text-xl" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {organization?.total_hires ||
                                            organization?.hired_candidates ||
                                            organization?.successful_applications ||
                                            '3+'}
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">Candidates Hired</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        {organization?.total_hires > 10 ? 'High Success Rate' :
                                            organization?.total_hires > 5 ? 'Good Track Record' : 'Building Success'}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Additional Metrics Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* Response Rate */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Response Rate</h4>
                                        <p className="text-sm text-gray-600">Average response time to applications</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-[#00A55F]">
                                            {organization?.avg_response_time || '24h'}
                                        </div>
                                        <div className="text-xs text-gray-500">Average</div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Status */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Verification Status</h4>
                                        <p className="text-sm text-gray-600">Organization verification level</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            {organization?.is_verified ? (
                                                <>
                                                    <VerifiedBadge size={18} />
                                                    <span className="text-blue-600 font-semibold">Verified</span>
                                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Trusted Partner</span>
                                                </>
                                            ) : (
                                                <span className="text-gray-500">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>



                        {/* Call to Action */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3 }}
                            className="mt-8 text-center"
                        >
                            <div className="bg-gradient-to-r from-[#00A55F] to-emerald-600 rounded-xl p-6 text-white">
                                <h4 className="text-lg font-semibold mb-2">Ready to Join This Team?</h4>
                                <p className="text-white/90 text-sm mb-4">
                                    This organization has a proven track record of hiring talented candidates.
                                    Don't miss your opportunity to be part of their success story!
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={scrollToApply}
                                    className="bg-white text-[#00A55F] px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Apply Now
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Share Menu */}
            <ShareMenu
                isOpen={showShareMenu}
                onClose={() => setShowShareMenu(false)}
                url={window.location.href}
                title={`${internship?.title} at ${organization?.name} - Stage222`}
            />

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />

            {/* Apply Modal */}
            <ApplyModal
                isOpen={applyModalOpen}
                onClose={() => setApplyModalOpen(false)}
                internship={internship}
                onSuccess={() => {
                    setApplyModalOpen(false);
                    // Optionally, refetch or increment applicant count
                }}
            />
        </div>
    );
};

export default InternshipDetail;
