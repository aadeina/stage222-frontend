import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { FaBuilding, FaGlobe, FaMapMarkerAlt, FaUsers, FaLinkedin, FaFacebook, FaInstagram, FaUpload, FaTrash, FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const EditOrganization = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showNameWarning, setShowNameWarning] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [organizationId, setOrganizationId] = useState(id); // Use ID from URL if available

    const [formData, setFormData] = useState({
        name: '',
        about: '',
        website: '',
        industry: '',
        city: '',
        employee_range: '',
        social_links: {
            linkedin: '',
            facebook: '',
            instagram: ''
        },
        is_independent: false
    });

    const [files, setFiles] = useState({
        logo: null,
        license_document: null
    });

    const [errors, setErrors] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    // Dropdown options
    const industries = [
        "Advertising/Marketing",
        "Agriculture/Dairy",
        "Animation",
        "Architecture/Interior Design",
        "Automobile",
        "BPO",
        "Biotechnology",
        "Consulting",
        "Data Science/AI",
        "Design/UX",
        "E-commerce",
        "Education",
        "Finance",
        "Government/Public Sector",
        "Healthcare",
        "HR/Recruitment",
        "IT/Software",
        "Legal",
        "Logistics/Supply Chain",
        "Manufacturing",
        "Media/Journalism",
        "NGO / Non-Profit",
        "Retail",
        "Telecommunications",
        "Travel & Tourism",
        "Other"
    ];

    const cities = [
        "Nouakchott",
        "Nouadhibou",
        "Aïoun",
        "Akjoujt",
        "Aleg",
        "Atar",
        "Kaédi",
        "Kiffa",
        "Néma",
        "Rosso",
        "Sélibabi",
        "Tidjikdja",
        "Zouerate"
    ];

    const employeeRanges = [
        "0–1",
        "2–10",
        "11–50",
        "51–200",
        "201–500",
        "501–1000",
        "1001–5000",
        "5000+"
    ];

    // Check if user is authorized and fetch organization data
    useEffect(() => {
        if (!user || user.role !== 'recruiter') {
            navigate('/login');
            return;
        }

        // If no ID in URL, fetch it from recruiter data
        if (!organizationId) {
            fetchRecruiterAndOrganization();
        } else {
            fetchOrganizationData();
        }
    }, [user, navigate, organizationId]);

    const fetchRecruiterAndOrganization = async () => {
        try {
            // Fetch current recruiter data to get organization ID
            const response = await api.get('/recruiters/me/');
            const recruiterData = response.data.data || response.data;

            if (recruiterData?.organization) {
                setOrganizationId(recruiterData.organization);
            } else {
                toast.error('No organization found. Please contact support.');
                navigate('/recruiter/dashboard');
            }
        } catch (error) {
            console.error('Error fetching recruiter data:', error);
            toast.error('Failed to load organization information');
            navigate('/recruiter/dashboard');
        }
    };

    // Fetch organization data when organizationId is available
    useEffect(() => {
        if (organizationId) {
            fetchOrganizationData();
        }
    }, [organizationId]);

    const fetchOrganizationData = async () => {
        try {
            const response = await api.get(`/organizations/${organizationId}/`);
            const orgData = response.data.data || response.data;

            // Check if user owns this organization
            // if (orgData.owner !== user.id) {
            //     toast.error('You are not authorized to edit this organization');
            //     navigate('/recruiter/dashboard');
            //     return;
            // }

            setOriginalData(orgData);
            setFormData({
                name: orgData.name || '',
                about: orgData.about || '',
                website: orgData.website || '',
                industry: orgData.industry || '',
                city: orgData.city || '',
                employee_range: orgData.employee_range || '',
                social_links: {
                    linkedin: orgData.social_links?.linkedin || '',
                    facebook: orgData.social_links?.facebook || '',
                    instagram: orgData.social_links?.instagram || ''
                },
                is_independent: orgData.is_independent || false
            });
        } catch (error) {
            console.error('Error fetching organization:', error);
            toast.error('Failed to load organization data');
            navigate('/recruiter/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    // Check for changes
    useEffect(() => {
        if (!originalData) return;

        const hasFormChanges = JSON.stringify(formData) !== JSON.stringify({
            name: originalData.name || '',
            about: originalData.about || '',
            website: originalData.website || '',
            industry: originalData.industry || '',
            city: originalData.city || '',
            employee_range: originalData.employee_range || '',
            social_links: {
                linkedin: originalData.social_links?.linkedin || '',
                facebook: originalData.social_links?.facebook || '',
                instagram: originalData.social_links?.instagram || ''
            },
            is_independent: originalData.is_independent || false
        });

        const hasFileChanges = files.logo || files.license_document;

        setHasChanges(hasFormChanges || hasFileChanges);
    }, [formData, files, originalData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type and size
        if (fileType === 'logo') {
            if (!file.type.startsWith('image/')) {
                toast.error('Logo must be an image file (PNG, JPG, GIF)');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB
                toast.error('Logo file size must be less than 2MB');
                return;
            }
        } else if (fileType === 'license_document') {
            if (file.type !== 'application/pdf') {
                toast.error('License document must be a PDF file');
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB
                toast.error('License document size must be less than 10MB');
                return;
            }
        }

        setFiles(prev => ({
            ...prev,
            [fileType]: file
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Organization name is required';
        }

        if (formData.website && !isValidUrl(formData.website)) {
            newErrors.website = 'Please enter a valid URL';
        }

        if (formData.social_links.linkedin && !isValidUrl(formData.social_links.linkedin)) {
            newErrors['social_links.linkedin'] = 'Please enter a valid LinkedIn URL';
        }

        if (formData.social_links.facebook && !isValidUrl(formData.social_links.facebook)) {
            newErrors['social_links.facebook'] = 'Please enter a valid Facebook URL';
        }

        if (formData.social_links.instagram && !isValidUrl(formData.social_links.instagram)) {
            newErrors['social_links.instagram'] = 'Please enter a valid Instagram URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        // Show name change warning if needed
        if (formData.name !== originalData.name) {
            setShowNameWarning(true);
            return;
        }

        await saveChanges();
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            const formDataToSend = new FormData();

            // Add form fields
            Object.keys(formData).forEach(key => {
                if (key === 'social_links') {
                    formDataToSend.append('social_links', JSON.stringify(formData.social_links));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add files if changed
            if (files.logo) {
                formDataToSend.append('logo', files.logo);
            }
            if (files.license_document) {
                formDataToSend.append('license_document', files.license_document);
            }

            await api.patch(`/organizations/${organizationId}/update/`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Organization updated successfully!');
            navigate('/recruiter/dashboard');
        } catch (error) {
            console.error('Error updating organization:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update organization';
            toast.error(errorMessage);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setIsSaving(false);
            setShowNameWarning(false);
        }
    };

    const handleCancel = () => {
        navigate('/recruiter/dashboard');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A55F] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading organization data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/recruiter/dashboard')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <nav className="flex space-x-2 text-sm text-gray-500">
                                    <span>Dashboard</span>
                                    <span>/</span>
                                    <span className="text-gray-900">Edit Organization</span>
                                </nav>
                                <h1 className="text-2xl font-bold text-gray-900 mt-1">Edit Organization</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {originalData?.logo && (
                                <img
                                    src={originalData.logo}
                                    alt="Organization Logo"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            )}
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{originalData?.name}</p>
                                <p className="text-xs text-gray-500">Organization</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Organization Information</h2>
                        <p className="text-sm text-gray-600 mt-1">Update your organization details and settings</p>
                    </div>

                    <form className="p-6 space-y-8">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Organization Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter organization name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Website
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaGlobe className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.website ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="https://example.com"
                                    />
                                </div>
                                {errors.website && (
                                    <p className="mt-1 text-sm text-red-500">{errors.website}</p>
                                )}
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                About Organization
                            </label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleInputChange}
                                rows="4"
                                maxLength="500"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors resize-none"
                                placeholder="Tell us about your organization..."
                            />
                            <div className="mt-1 text-xs text-gray-500 text-right">
                                {formData.about.length}/500 characters
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <motion.button
                                type="button"
                                onClick={handleCancel}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors"
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                whileHover={{ scale: hasChanges && !isSaving ? 1.02 : 1 }}
                                whileTap={{ scale: hasChanges && !isSaving ? 0.98 : 1 }}
                                className={`px-6 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors ${hasChanges && !isSaving
                                    ? 'bg-[#00A55F] hover:bg-[#008c4f]'
                                    : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                {isSaving ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <FaSave className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </div>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </main>

            {/* Name Change Warning Modal */}
            <AnimatePresence>
                {showNameWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg p-6 max-w-md w-full"
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0">
                                    <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-gray-900">Change Organization Name?</h3>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-6">
                                Changing your organization name may affect your visibility and branding. Are you sure you want to proceed?
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowNameWarning(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveChanges}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#00A55F] rounded-md hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F]"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditOrganization; 