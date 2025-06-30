import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaUsers, FaBuilding, FaArrowLeft, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { MdBusiness } from 'react-icons/md';
import api from '../../services/api';
import moment from 'moment';
import InternshipCard from '../../components/InternshipCard';

const RecruiterOpportunities = () => {
    const { recruiterId } = useParams();
    const navigate = useNavigate();
    const [opportunities, setOpportunities] = useState([]);
    const [recruiter, setRecruiter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchRecruiterOpportunities();
        fetchRecruiterData();
    }, [recruiterId]);

    const fetchRecruiterOpportunities = async () => {
        try {
            // Use public internships endpoint filtered by recruiter
            const response = await api.get(`/internships/?recruiter=${recruiterId}&limit=100`);
            const allOpportunities = response.data.results || response.data || [];

            // Filter opportunities to only include those by this specific recruiter
            const recruiterOpportunities = allOpportunities.filter(opportunity => {
                return opportunity.recruiter === parseInt(recruiterId) ||
                    opportunity.recruiter_id === parseInt(recruiterId) ||
                    opportunity.user === parseInt(recruiterId) ||
                    opportunity.recruiter === recruiterId ||
                    opportunity.recruiter_id === recruiterId ||
                    opportunity.user === recruiterId;
            });

            setOpportunities(recruiterOpportunities);
        } catch (error) {
            console.error('Error fetching recruiter opportunities:', error);
            // Fallback to empty array
            setOpportunities([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecruiterData = async () => {
        try {
            // Try to get recruiter profile data
            const response = await api.get(`/recruiters/${recruiterId}/`);
            const recruiterData = response.data.data || response.data;
            setRecruiter(recruiterData);
        } catch (error) {
            console.error('Error fetching recruiter data:', error);
            // Set basic recruiter info if API fails
            setRecruiter({ id: recruiterId, first_name: 'Recruiter', last_name: '' });
        }
    };

    const filteredOpportunities = opportunities.filter(opportunity => {
        const matchesSearch = opportunity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' ||
            opportunity.opportunity_type?.toLowerCase() === filterType ||
            opportunity.type?.toLowerCase() === filterType;

        const matchesStatus = filterStatus === 'all' ||
            opportunity.status?.toLowerCase() === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const getTypeColor = (type) => {
        const opportunityType = type?.toLowerCase();
        return opportunityType === 'internship' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
    };

    const formatType = (type) => {
        const opportunityType = type?.toLowerCase();
        return opportunityType === 'internship' ? 'Internship' : 'Job';
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A55F] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading opportunities...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="h-5 w-5" />
                        </motion.button>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Opportunities by {recruiter?.first_name} {recruiter?.last_name}
                            </h1>
                            <p className="text-gray-600">
                                {opportunities.length} opportunity{opportunities.length !== 1 ? 'ies' : 'y'} posted
                            </p>
                        </div>

                        {recruiter?.organization && (
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                                <div className="w-8 h-8 bg-[#00A55F] rounded-full flex items-center justify-center">
                                    <MdBusiness className="text-white text-sm" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{recruiter.organization.name}</p>
                                    <p className="text-xs text-gray-500">{recruiter.designation}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search opportunities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-transparent"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-transparent"
                        >
                            <option value="all">All Types</option>
                            <option value="internship">Internships</option>
                            <option value="job">Jobs</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="draft">Draft</option>
                        </select>

                        {/* Results Count */}
                        <div className="flex items-center justify-center px-4 py-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">
                                {filteredOpportunities.length} result{filteredOpportunities.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Opportunities Grid */}
                {filteredOpportunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOpportunities.map((opportunity, index) => (
                            <motion.div
                                key={opportunity.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <InternshipCard internship={opportunity} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <FaBriefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
                        <p className="text-gray-600">
                            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'This recruiter hasn\'t posted any opportunities yet'
                            }
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RecruiterOpportunities; 