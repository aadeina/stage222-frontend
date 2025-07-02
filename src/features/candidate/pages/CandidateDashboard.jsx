import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { FaBriefcase, FaSearch, FaBookmark, FaUser, FaExclamationTriangle, FaTimes, FaFileAlt, FaChevronLeft, FaChevronRight, FaStar, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [currentRecommendedSlide, setCurrentRecommendedSlide] = useState(0);
    const [currentTrendingSlide, setCurrentTrendingSlide] = useState(0);

    // Mock user data for development
    const mockUser = {
        first_name: 'Amar Med',
        last_name: 'Moctar',
        email: 'amarmed4500@gmail.com',
        role: 'candidate'
    };

    // Use mock user for development
    const currentUser = user || mockUser;

    // Mock data for development
    const mockStats = {
        applications: 12,
        interviews: 3,
        savedJobs: 8,
        profileViews: 24
    };

    const mockRecentApplications = [
        {
            id: 1,
            title: "Software Development Intern",
            company: "Tech Solutions MR",
            status: "Under Review",
            appliedDate: "2024-01-15",
            logo: "https://via.placeholder.com/40x40/00A55F/FFFFFF?text=TS"
        },
        {
            id: 2,
            title: "Marketing Assistant",
            company: "Digital Marketing Agency",
            status: "Interview Scheduled",
            appliedDate: "2024-01-12",
            logo: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=DM"
        },
        {
            id: 3,
            title: "Business Development Intern",
            company: "Growth Partners",
            status: "Application Submitted",
            appliedDate: "2024-01-10",
            logo: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=GP"
        }
    ];

    // Mock data for recommended opportunities
    const mockRecommendedOpportunities = [
        {
            id: 1,
            title: "Full Stack Development Course",
            company: "Stage222 Academy",
            type: "Course",
            location: "Online",
            salary: "3-10 LPA guaranteed placement",
            duration: "6 Months",
            logo: "https://via.placeholder.com/60x60/00A55F/FFFFFF?text=SA",
            isCourse: true,
            features: ["Guaranteed placement", "Top companies hiring", "Live projects"]
        },
        {
            id: 2,
            title: "Business Development (Sales)",
            company: "Mulberry Solutions LLP",
            type: "Internship",
            location: "Work From Home",
            salary: "55,000 - 2,50,000 /month",
            duration: "1 Month",
            logo: "https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=MS",
            isCourse: false
        },
        {
            id: 3,
            title: "Software Development",
            company: "DiligenceVault",
            type: "Internship",
            location: "Work From Home",
            salary: "25,000 - 40,000 /month",
            duration: "6 Months",
            logo: "https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=DV",
            isCourse: false
        },
        {
            id: 4,
            title: "Digital Marketing",
            company: "B Anu Designs",
            type: "Internship",
            location: "Work From Home",
            salary: "10,000 - 25,000 /month",
            duration: "6 Months",
            logo: "https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=BA",
            isCourse: false
        },
        {
            id: 5,
            title: "React Native Development",
            company: "Digiretail Software",
            type: "Internship",
            location: "Work From Home",
            salary: "20,000 - 25,000 /month",
            duration: "6 Months",
            logo: "https://via.placeholder.com/60x60/EF4444/FFFFFF?text=DS",
            isCourse: false
        },
        {
            id: 6,
            title: "Content Writing",
            company: "ComplyJet",
            type: "Internship",
            location: "Work From Home",
            salary: "25,000 - 35,000 /month",
            duration: "3 Months",
            logo: "https://via.placeholder.com/60x60/10B981/FFFFFF?text=CJ",
            isCourse: false
        }
    ];

    // Mock data for trending opportunities
    const mockTrendingOpportunities = [
        {
            id: 1,
            title: "International Business Development",
            company: "Yogaamie",
            type: "Internship",
            location: "Work From Home",
            salary: "15,000 - 30,000 /month",
            duration: "2 Months",
            logo: "https://via.placeholder.com/60x60/00A55F/FFFFFF?text=YG",
            trending: true
        },
        {
            id: 2,
            title: "Community Engagement Specialist",
            company: "Get Structured Consulting",
            type: "Internship",
            location: "Work From Home",
            salary: "20,000 - 25,000 /month",
            duration: "6 Months",
            logo: "https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=GS",
            trending: true
        },
        {
            id: 3,
            title: "Full Stack Development",
            company: "Vyaasa",
            type: "Internship",
            location: "Work From Home",
            salary: "15,000 - 20,000 /month",
            duration: "3 Months",
            logo: "https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=VY",
            trending: true
        },
        {
            id: 4,
            title: "Content Creation",
            company: "CollegeTips Ed Tech",
            type: "Internship",
            location: "Work From Home",
            salary: "10,000 - 25,000 /month",
            duration: "1 Month",
            logo: "https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=CT",
            trending: true
        },
        {
            id: 5,
            title: "Marketing",
            company: "Sumeet Singh",
            type: "Internship",
            location: "Work From Home",
            salary: "15,000 - 20,000 /month",
            duration: "3 Months",
            logo: "https://via.placeholder.com/60x60/EF4444/FFFFFF?text=SS",
            trending: true
        },
        {
            id: 6,
            title: "Business Development (Sales)",
            company: "Social Amplifiers",
            type: "Internship",
            location: "Work From Home",
            salary: "55,000 - 1,05,000 /month",
            duration: "6 Months",
            logo: "https://via.placeholder.com/60x60/10B981/FFFFFF?text=SA",
            trending: true
        }
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    // Carousel navigation functions
    const nextRecommendedSlide = () => {
        setCurrentRecommendedSlide((prev) =>
            prev === Math.ceil(mockRecommendedOpportunities.length / 3) - 1 ? 0 : prev + 1
        );
    };

    const prevRecommendedSlide = () => {
        setCurrentRecommendedSlide((prev) =>
            prev === 0 ? Math.ceil(mockRecommendedOpportunities.length / 3) - 1 : prev - 1
        );
    };

    const nextTrendingSlide = () => {
        setCurrentTrendingSlide((prev) =>
            prev === Math.ceil(mockTrendingOpportunities.length / 3) - 1 ? 0 : prev + 1
        );
    };

    const prevTrendingSlide = () => {
        setCurrentTrendingSlide((prev) =>
            prev === 0 ? Math.ceil(mockTrendingOpportunities.length / 3) - 1 : prev - 1
        );
    };



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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Applications</p>
                                <p className="text-2xl font-bold text-gray-900">{mockStats.applications}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FaFileAlt className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Interviews</p>
                                <p className="text-2xl font-bold text-gray-900">{mockStats.interviews}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FaUser className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{mockStats.savedJobs}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <FaBookmark className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                                <p className="text-2xl font-bold text-gray-900">{mockStats.profileViews}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <FaUser className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions - Responsive grid, stack on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate('/internships')}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FaSearch className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Find Internships</h3>
                                <p className="text-gray-600">Browse available opportunities</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate('/jobs')}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FaBriefcase className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Find Jobs</h3>
                                <p className="text-gray-600">Explore job opportunities</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate('/profile')}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <FaUser className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
                                <p className="text-gray-600">Manage your profile</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Applications - Responsive, ensure no overflow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                        <button className="text-sm text-[#00A55F] hover:text-[#008c4f] font-medium">View All</button>
                    </div>
                    <div className="p-4 sm:p-6">
                        {mockRecentApplications.length > 0 ? (
                            <div className="space-y-4">
                                {mockRecentApplications.map((application, index) => (
                                    <motion.div
                                        key={application.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <img
                                            src={application.logo}
                                            alt={application.company}
                                            className="w-10 h-10 rounded-lg object-cover mb-2 sm:mb-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">{application.title}</h3>
                                            <p className="text-sm text-gray-600 truncate">{application.company}</p>
                                            <p className="text-xs text-gray-500">Applied on {application.appliedDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.status === 'Interview Scheduled'
                                                ? 'bg-green-100 text-green-800'
                                                : application.status === 'Under Review'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
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