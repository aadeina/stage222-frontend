import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaArrowRight, FaBuilding, FaCheckCircle, FaTimes, FaClock as FaClockIcon } from 'react-icons/fa';
import moment from 'moment';
import VerifiedBadge from '@/components/VerifiedBadge';

const fallbackLogo = '/Stage222-icon.png';

const InternshipCard = ({ internship, onClick }) => {
    const { t } = useTranslation();
    const {
        id,
        title,
        organization,
        location,
        stipend_type,
        stipend,
        fixed_pay_max,
        duration,
        duration_weeks,
        created_at,
        job_type,
        approval_status,
        description,
        status,
    } = internship;

    const organization_name = internship.organization_name || organization?.name;
    const organization_logo = internship.organization_logo || organization?.logo;

    console.log('InternshipCard received data:', {
        id,
        title,
        organization_name,
        organization_logo,
        status
    });

    const logoUrl = organization_logo
        ? (organization_logo.startsWith('http')
            ? organization_logo
            : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${organization_logo}`)
        : fallbackLogo;

    // Status helpers
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
            case 'active':
                return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 shadow-green-200/50';
            case 'closed':
            case 'inactive':
                return 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-400 shadow-red-200/50';
            case 'draft':
            case 'pending':
                return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-yellow-400 shadow-yellow-200/50';
            default:
                return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400 shadow-gray-200/50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
            case 'active':
                return <FaCheckCircle className="h-3 w-3" />;
            case 'closed':
            case 'inactive':
                return <FaTimes className="h-3 w-3" />;
            case 'draft':
            case 'pending':
                return <FaClockIcon className="h-3 w-3" />;
            default:
                return <FaClockIcon className="h-3 w-3" />;
        }
    };

    const formatStatus = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return t('internshipCard.open');
            case 'closed':
                return t('internshipCard.closed');
            case 'draft':
                return t('internshipCard.draft');
            case 'pending':
                return t('internshipCard.pending');
            default:
                return status?.toUpperCase() || t('internshipCard.unknown');
        }
    };

    // Badges
    const isActivelyHiring = approval_status === 'approved';
    const isPartTime = job_type === 'part-time';
    const hasJobOffer = description?.toLowerCase().includes('job offer');

    // Stipend display
    let stipendDisplay = '';
    if (stipend_type === 'paid') {
        if (stipend && fixed_pay_max && stipend !== fixed_pay_max) {
            stipendDisplay = `MRU ${stipend} - ${fixed_pay_max}`;
        } else if (stipend) {
            stipendDisplay = `MRU ${stipend}`;
        } else {
            stipendDisplay = t('internshipCard.paid');
        }
    } else {
        stipendDisplay = t('internshipCard.unpaid');
    }

    // Duration display
    const durationDisplay = duration || (duration_weeks ? `${duration_weeks} Weeks` : '');

    // Posted time
    const postedTime = created_at ? moment(created_at).fromNow() : '';

    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,165,95,0.10)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex bg-white rounded-2xl shadow border border-gray-100 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
            onClick={onClick}
        >
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gray-50">
                <img
                    src={logoUrl}
                    alt={organization_name || 'Organization'}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg"
                    onError={e => (e.target.src = fallbackLogo)}
                />
            </div>

            {/* Info */}
            <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between">
                <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">{title}</h3>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            {isActivelyHiring && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-[#00A55F]">
                                    {t('internshipCard.activelyHiring')}
                                </span>
                            )}
                            {/* Status Badge */}
                            {status && (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full border shadow-sm ${getStatusColor(status)}`}>
                                    {getStatusIcon(status)}
                                    <span className="hidden sm:inline">{formatStatus(status)}</span>
                                    <span className="sm:hidden">{formatStatus(status).substring(0, 3)}</span>
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <FaBuilding className="inline-block mr-1 text-gray-400" />
                        <span className="font-medium flex items-center gap-1">
                            <span>{organization_name}</span>
                            {organization?.is_verified && <VerifiedBadge className="ml-1" />}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3 items-center text-xs mb-2">
                        <span className="flex items-center gap-1 text-gray-500"><FaMapMarkerAlt /> <span className="hidden sm:inline">{location || t('internshipCard.remote')}</span><span className="sm:hidden">{location ? (location.length > 10 ? location.substring(0, 10) + '...' : location) : t('internshipCard.remote')}</span></span>
                        <span className="flex items-center gap-1 text-gray-500"><FaMoneyBillWave /> <span className="hidden sm:inline">{stipendDisplay}</span><span className="sm:hidden">{stipendDisplay.length > 8 ? stipendDisplay.substring(0, 8) + '...' : stipendDisplay}</span></span>
                        {durationDisplay && (
                            <span className="flex items-center gap-1 text-gray-500"><FaClock /> <span className="hidden sm:inline">{durationDisplay}</span><span className="sm:hidden">{durationDisplay.length > 8 ? durationDisplay.substring(0, 8) + '...' : durationDisplay}</span></span>
                        )}
                        {isPartTime && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">{t('internshipCard.partTime')}</span>
                        )}
                        {hasJobOffer && (
                            <span className="px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-semibold">
                                <span className="hidden sm:inline">{t('internshipCard.jobOfferAfterInternship')}</span>
                                <span className="sm:hidden">{t('internshipCard.jobOffer')}</span>
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs text-gray-400"><span className="hidden sm:inline">{t('internshipCard.posted')} </span>{postedTime}</span>
                        {/* Status Indicator */}
                        {status && (
                            <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${status?.toLowerCase() === 'open' ? 'bg-green-500' :
                                    status?.toLowerCase() === 'closed' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`} />
                                <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                                    {status?.toLowerCase() === 'open' ? t('internshipCard.openStatus') :
                                        status?.toLowerCase() === 'closed' ? t('internshipCard.closedStatus') : t('internshipCard.draftStatus')}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        className="ml-2 p-2 rounded-full bg-[#00A55F] hover:bg-[#008c4f] text-white transition-colors"
                        aria-label={t('internshipCard.viewDetails')}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default InternshipCard;
