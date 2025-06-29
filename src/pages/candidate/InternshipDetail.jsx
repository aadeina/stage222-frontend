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
    FaCheckDouble
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

const fallbackLogo = 'https://ui-avatars.com/api/?name=Stage222&background=00A55F&color=fff&rounded=true';

const InternshipDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const applyButtonRef = useRef(null);

    useEffect(() => {
        const fetchInternship = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getInternshipDetail(id);
                setInternship(response.data);

                // Check if internship is saved (from localStorage for now)
                const savedInternships = JSON.parse(localStorage.getItem('savedInternships') || '[]');
                setIsSaved(savedInternships.includes(id));
            } catch (err) {
                console.error('Error fetching internship:', err);
                setError('Failed to load internship details.');
                toast.error('Failed to load internship details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchInternship();
        }
    }, [id]);

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

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy link');
        }
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

    const organization = internship.organization || {};
    const logoUrl = organization.logo
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
                                <p className="text-sm text-gray-600">{organization.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
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
                                    alt={organization.name || 'Organization'}
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
                                                {organization.name}
                                            </span>
                                        </div>
                                    </div>
                                    {isActivelyHiring && (
                                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-[#00A55F] border border-green-200">
                                            Actively hiring
                                        </span>
                                    )}
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

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span>Posted {formatPostedTime()}</span>
                                    {internship.num_applicants && (
                                        <span>• {internship.num_applicants} applicants</span>
                                    )}
                                    {internship.job_offer_max && (
                                        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
                                            Job offer up to MRU {internship.job_offer_max}
                                        </span>
                                    )}
                                </div>

                                {/* Apply Button */}
                                <button
                                    onClick={handleApply}
                                    disabled={isApplying}
                                    className="w-full sm:w-auto px-8 py-3 bg-[#00A55F] text-white font-semibold rounded-lg hover:bg-[#008c4f] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isApplying ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Applying...
                                        </div>
                                    ) : (
                                        'Apply Now'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                            {/* About the Organization */}
                            {organization.about && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaBuilding className="text-[#00A55F]" />
                                        About {organization.name}
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                        {organization.about}
                                    </p>
                                    {organization.website && (
                                        <a
                                            href={organization.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[#00A55F] hover:text-[#008c4f] text-sm font-medium"
                                        >
                                            <FaGlobe />
                                            Visit website
                                            <FaExternalLinkAlt className="text-xs" />
                                        </a>
                                    )}
                                </motion.div>
                            )}

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
                            <button
                                onClick={handleApply}
                                disabled={isApplying}
                                className="px-8 py-3 bg-[#00A55F] text-white font-semibold rounded-lg hover:bg-[#008c4f] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isApplying ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Applying...
                                    </div>
                                ) : (
                                    'Apply Now'
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Organization Activity Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MdBusiness className="text-[#00A55F]" />
                            Organization Activity
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <div className="text-2xl font-bold text-[#00A55F]">
                                    {organization.hiring_since ?
                                        moment(organization.hiring_since).format('MMM YYYY') :
                                        moment(organization.created_at || internship.created_at).format('MMM YYYY')
                                    }
                                </div>
                                <p className="text-sm text-gray-600">Hiring since</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <div className="text-2xl font-bold text-[#00A55F]">
                                    {organization.total_opportunities_posted || '10+'}
                                </div>
                                <p className="text-sm text-gray-600">opportunities posted</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <div className="text-2xl font-bold text-[#00A55F]">
                                    {organization.total_hires || '5+'}
                                </div>
                                <p className="text-sm text-gray-600">candidates hired</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </div>
    );
};

export default InternshipDetail;
