import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '@/services/api';
import {
    FaBuilding,
    FaGlobe,
    FaMapMarkerAlt,
    FaUsers,
    FaLinkedin,
    FaFacebook,
    FaInstagram,
    FaUpload,
    FaTrash,
    FaSave,
    FaTimes,
    FaExclamationTriangle,
    FaCalendarAlt,
    FaIndustry,
    FaPhone,
    FaEnvelope,
    FaEye,
    FaEdit,
    FaCheckCircle,
    FaArrowLeft,
    FaImage,
    FaFileUpload
} from 'react-icons/fa';

const EditOrganization = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showNameWarning, setShowNameWarning] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [organizationId, setOrganizationId] = useState(id);
    const [logoPreview, setLogoPreview] = useState(null);
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        about: '',
        website: '',
        industry: '',
        city: '',
        employee_range: '',
        founded_year: '',
        phone: '',
        email: '',
        address: '',
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

    // Enhanced dropdown options - Matching backend choices exactly
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

    const foundedYears = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

    // Check if user is authorized and fetch organization data
    useEffect(() => {
        if (!user || user.role !== 'recruiter') {
            navigate('/login');
            return;
        }

        if (!organizationId) {
            fetchRecruiterAndOrganization();
        } else {
            fetchOrganizationData();
        }
    }, [user, navigate, organizationId]);

    const fetchRecruiterAndOrganization = async () => {
        try {
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

    useEffect(() => {
        if (organizationId) {
            fetchOrganizationData();
        }
    }, [organizationId]);

    const fetchOrganizationData = async () => {
        try {
            const response = await api.get(`/organizations/${organizationId}/`);
            const orgData = response.data.data || response.data;

            console.log('Organization data received:', orgData);
            console.log('Social links data:', orgData.social_links);

            // Handle different social links data structures
            let socialLinks = {
                linkedin: '',
                facebook: '',
                instagram: ''
            };

            if (orgData.social_links) {
                if (Array.isArray(orgData.social_links)) {
                    // Handle array format: [linkedin, facebook, instagram]
                    socialLinks = {
                        linkedin: orgData.social_links[0] || '',
                        facebook: orgData.social_links[1] || '',
                        instagram: orgData.social_links[2] || ''
                    };
                } else if (typeof orgData.social_links === 'object') {
                    // Handle object format: {linkedin: '', facebook: '', instagram: ''}
                    socialLinks = {
                        linkedin: orgData.social_links.linkedin || '',
                        facebook: orgData.social_links.facebook || '',
                        instagram: orgData.social_links.instagram || ''
                    };
                } else if (typeof orgData.social_links === 'string') {
                    // Handle JSON string format
                    try {
                        const parsedLinks = JSON.parse(orgData.social_links);
                        socialLinks = {
                            linkedin: parsedLinks.linkedin || '',
                            facebook: parsedLinks.facebook || '',
                            instagram: parsedLinks.instagram || ''
                        };
                    } catch (e) {
                        // If parsing fails, treat as single LinkedIn link
                        socialLinks.linkedin = orgData.social_links;
                    }
                }
            }

            console.log('Processed social links:', socialLinks);

            setOriginalData(orgData);
            setFormData({
                name: orgData.name || '',
                about: orgData.about || '',
                website: orgData.website || '',
                industry: orgData.industry || '',
                city: orgData.city || '',
                employee_range: orgData.employee_range || '',
                founded_year: orgData.founded_year || '',
                phone: orgData.phone_number || orgData.phone || '',
                email: orgData.email || '',
                address: orgData.address || '',
                social_links: socialLinks,
                is_independent: orgData.is_independent || false
            });

            // Set logo preview if exists
            if (orgData.logo) {
                const logoUrl = orgData.logo.startsWith('http')
                    ? orgData.logo
                    : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${orgData.logo}`;
                setLogoPreview(logoUrl);
            }
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

        // Process social links for comparison (same logic as fetchOrganizationData)
        let originalSocialLinks = {
            linkedin: '',
            facebook: '',
            instagram: ''
        };

        if (originalData.social_links) {
            if (Array.isArray(originalData.social_links)) {
                originalSocialLinks = {
                    linkedin: originalData.social_links[0] || '',
                    facebook: originalData.social_links[1] || '',
                    instagram: originalData.social_links[2] || ''
                };
            } else if (typeof originalData.social_links === 'object') {
                originalSocialLinks = {
                    linkedin: originalData.social_links.linkedin || '',
                    facebook: originalData.social_links.facebook || '',
                    instagram: originalData.social_links.instagram || ''
                };
            } else if (typeof originalData.social_links === 'string') {
                // Handle JSON string format
                try {
                    const parsedLinks = JSON.parse(originalData.social_links);
                    originalSocialLinks = {
                        linkedin: parsedLinks.linkedin || '',
                        facebook: parsedLinks.facebook || '',
                        instagram: parsedLinks.instagram || ''
                    };
                } catch (e) {
                    // If parsing fails, treat as single LinkedIn link
                    originalSocialLinks.linkedin = originalData.social_links;
                }
            }
        }

        const hasFormChanges = JSON.stringify(formData) !== JSON.stringify({
            name: originalData.name || '',
            about: originalData.about || '',
            website: originalData.website || '',
            industry: originalData.industry || '',
            city: originalData.city || '',
            employee_range: originalData.employee_range || '',
            founded_year: originalData.founded_year || '',
            phone: originalData.phone_number || originalData.phone || '',
            email: originalData.email || '',
            address: originalData.address || '',
            social_links: originalSocialLinks,
            is_independent: originalData.is_independent || false
        });

        const hasFileChanges = files.logo || files.license_document;

        setHasChanges(hasFormChanges || hasFileChanges);
    }, [formData, files, originalData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSocialLinkChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [platform]: value
            }
        }));
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log(`Handling ${fileType} file:`, file);

        // Validate file size (5MB for logo, 10MB for license)
        const maxSize = fileType === 'logo' ? 5 : 10;
        if (file.size > maxSize * 1024 * 1024) {
            toast.error(`${fileType === 'logo' ? 'Logo' : 'License document'} size must be less than ${maxSize}MB`);
            return;
        }

        // Validate file type
        if (fileType === 'logo') {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file for logo');
                return;
            }
        } else if (fileType === 'license_document') {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please select a valid document file (PDF, DOC, or DOCX) for license document');
                return;
            }
        }

        setFiles(prev => ({
            ...prev,
            [fileType]: file
        }));

        // Create preview for logo
        if (fileType === 'logo') {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }

        console.log(`File ${fileType} set successfully`);
    };

    const removeLogo = () => {
        setFiles(prev => ({ ...prev, logo: null }));
        setLogoPreview(null);
        console.log('Logo removed');
    };

    const removeLicenseDocument = () => {
        setFiles(prev => ({ ...prev, license_document: null }));
        // Mark that we want to remove the existing license document
        setOriginalData(prev => ({ ...prev, license_document: null }));
        console.log('License document removed');
    };

    // Transform form data to match API requirements
    const transformFormDataForAPI = () => {
        const apiData = {
            founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
            phone_number: formData.phone || '',
            email: formData.email || '',
            address: formData.address || '',
            website: formData.website || '',
            social_links: [
                formData.social_links.linkedin || '',
                formData.social_links.facebook || '',
                formData.social_links.instagram || ''
            ].filter(link => link.trim() !== '') // Remove empty links
        };

        // Add optional fields if they have values
        if (formData.industry) apiData.industry = formData.industry;
        if (formData.city) apiData.city = formData.city;
        if (formData.employee_range) apiData.employee_range = formData.employee_range;
        if (formData.name) apiData.name = formData.name;
        if (formData.about) apiData.about = formData.about;

        return apiData;
    };

    // Validate form according to API requirements
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Organization name is required';
        }

        if (formData.website && !isValidUrl(formData.website)) {
            newErrors.website = 'Please enter a valid URL';
        }

        if (formData.email && !isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // API requirement: at least one verification method
        const hasWebsite = formData.website && formData.website.trim() !== '';
        const hasSocialLinks = Object.values(formData.social_links).some(link => link && link.trim() !== '');
        const hasLicenseDocument = files.license_document || originalData?.license_document;

        if (!hasWebsite && !hasSocialLinks && !hasLicenseDocument) {
            newErrors.verification = 'Please provide at least one verification method (website, social media links, or license document)';
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

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        if (formData.name !== originalData?.name) {
            setShowNameWarning(true);
        } else {
            await saveChanges();
        }
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            const apiData = transformFormDataForAPI();

            console.log('Submitting organization data:', apiData);
            console.log('Organization ID:', organizationId);
            console.log('Files to upload:', files);

            // Always use FormData for consistency with backend expectations
            const formData = new FormData();

            // Add all the form data
            Object.keys(apiData).forEach(key => {
                if (key === 'social_links') {
                    // Submit social_links as JSON string
                    formData.append('social_links', JSON.stringify(apiData.social_links));
                    console.log('Added social_links as JSON:', JSON.stringify(apiData.social_links));
                } else if (apiData[key] !== null && apiData[key] !== undefined && apiData[key] !== '') {
                    formData.append(key, apiData[key]);
                    console.log(`Added form field ${key}:`, apiData[key]);
                }
            });

            // Add files if present
            if (files.logo) {
                formData.append('logo', files.logo);
                console.log('Added logo file:', files.logo.name, files.logo.size);
            }
            if (files.license_document) {
                formData.append('license_document', files.license_document);
                console.log('Added license document:', files.license_document.name, files.license_document.size);
            }

            console.log('Using FormData for organization update');
            console.log('FormData entries:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            // Always use direct API call with FormData
            const response = await api.put(`/organizations/${organizationId}/update/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('API Response:', response.data);

            if (response.data.status === 'success') {
                toast.success(response.data.message || 'Organization updated successfully!');

                // Update local state with new data
                setOriginalData(response.data.data);
                setFiles({ logo: null, license_document: null });
                setHasChanges(false);
                setShowNameWarning(false);

                // Refresh the form data with updated values
                const updatedData = response.data.data;

                // Process social links from response (same logic as fetchOrganizationData)
                let updatedSocialLinks = {
                    linkedin: '',
                    facebook: '',
                    instagram: ''
                };

                if (updatedData.social_links) {
                    if (Array.isArray(updatedData.social_links)) {
                        // Handle array format: [linkedin, facebook, instagram]
                        updatedSocialLinks = {
                            linkedin: updatedData.social_links[0] || '',
                            facebook: updatedData.social_links[1] || '',
                            instagram: updatedData.social_links[2] || ''
                        };
                    } else if (typeof updatedData.social_links === 'object') {
                        // Handle object format: {linkedin: '', facebook: '', instagram: ''}
                        updatedSocialLinks = {
                            linkedin: updatedData.social_links.linkedin || '',
                            facebook: updatedData.social_links.facebook || '',
                            instagram: updatedData.social_links.instagram || ''
                        };
                    } else if (typeof updatedData.social_links === 'string') {
                        // Handle JSON string format
                        try {
                            const parsedLinks = JSON.parse(updatedData.social_links);
                            updatedSocialLinks = {
                                linkedin: parsedLinks.linkedin || '',
                                facebook: parsedLinks.facebook || '',
                                instagram: parsedLinks.instagram || ''
                            };
                        } catch (e) {
                            // If parsing fails, treat as single LinkedIn link
                            updatedSocialLinks.linkedin = updatedData.social_links;
                        }
                    }
                }

                setFormData(prev => ({
                    ...prev,
                    name: updatedData.name || prev.name,
                    about: updatedData.about || prev.about,
                    website: updatedData.website || prev.website,
                    industry: updatedData.industry || prev.industry,
                    city: updatedData.city || prev.city,
                    employee_range: updatedData.employee_range || prev.employee_range,
                    founded_year: updatedData.founded_year || prev.founded_year,
                    phone: updatedData.phone_number || updatedData.phone || prev.phone,
                    email: updatedData.email || prev.email,
                    address: updatedData.address || prev.address,
                    social_links: updatedSocialLinks
                }));

                // Update logo preview if a new logo was uploaded
                if (files.logo && response.data.data.logo) {
                    const logoUrl = response.data.data.logo.startsWith('http')
                        ? response.data.data.logo
                        : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${response.data.data.logo}`;
                    setLogoPreview(logoUrl);
                }
            } else {
                toast.error('Failed to update organization');
            }
        } catch (error) {
            console.error('Error updating organization:', error);

            if (error.response?.data?.non_field_errors) {
                // Handle backend validation errors
                error.response.data.non_field_errors.forEach(errorMsg => {
                    toast.error(errorMsg);
                });
                setErrors(prev => ({ ...prev, verification: error.response.data.non_field_errors[0] }));
            } else if (error.response?.data?.detail) {
                // Handle specific error messages
                toast.error(error.response.data.detail);
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 400) {
                toast.error('Please check your input and try again');
            } else if (error.response?.status === 401) {
                toast.error('You are not authorized to update this organization');
            } else if (error.response?.status === 404) {
                toast.error('Organization not found');
            } else if (error.response?.status === 415) {
                toast.error('File upload error. Please check file format and size.');
            } else {
                toast.error('Failed to update organization. Please try again.');
            }
        } finally {
            setIsSaving(false);
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
            {/* Professional Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/recruiter/dashboard')}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                <span className="text-sm font-medium">Back to Dashboard</span>
                            </button>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Organization Profile</h1>
                                <p className="text-sm text-gray-600 mt-1">Manage your company information and branding</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{originalData?.name}</p>
                                <p className="text-xs text-gray-500">Organization</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Logo and Basic Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Logo Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Logo</h3>

                            <div className="text-center">
                                <div
                                    className="relative mx-auto w-32 h-32 mb-4 cursor-pointer group"
                                    onMouseEnter={() => setIsLogoHovered(true)}
                                    onMouseLeave={() => setIsLogoHovered(false)}
                                >
                                    {logoPreview ? (
                                        <div className="relative">
                                            <img
                                                src={logoPreview}
                                                alt="Organization Logo"
                                                className="w-32 h-32 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                                            />
                                            <AnimatePresence>
                                                {isLogoHovered && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center"
                                                    >
                                                        <div className="flex space-x-2">
                                                            <label className="cursor-pointer">
                                                                <FaEdit className="w-5 h-5 text-white hover:text-gray-200" />
                                                            </label>
                                                            <button
                                                                onClick={removeLogo}
                                                                className="text-white hover:text-red-300"
                                                            >
                                                                <FaTrash className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                            <FaImage className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}

                                    <label className="block">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'logo')}
                                            className="hidden"
                                        />
                                        <div className="mt-4 px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors cursor-pointer text-sm font-medium">
                                            {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                        </div>
                                    </label>

                                    <p className="text-xs text-gray-500 mt-2">
                                        Recommended: 256x256px, Max 5MB
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-700">Company Size</span>
                                    </div>
                                    <span className="text-sm font-bold text-blue-600">
                                        {formData.employee_range || 'Not set'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FaIndustry className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium text-gray-700">Industry</span>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">
                                        {formData.industry || 'Not set'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="h-4 w-4 text-purple-600" />
                                        <span className="text-sm font-medium text-gray-700">Location</span>
                                    </div>
                                    <span className="text-sm font-bold text-purple-600">
                                        {formData.city || 'Not set'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm font-medium text-gray-700">Founded</span>
                                    </div>
                                    <span className="text-sm font-bold text-yellow-600">
                                        {formData.founded_year || 'Not set'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* License Document Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">License Document</h3>

                            <div className="space-y-4">
                                {/* Current License Display */}
                                {originalData?.license_document && (
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <FaFileUpload className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Current License</p>
                                                    <p className="text-xs text-gray-500">
                                                        {originalData.license_document.split('/').pop()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${originalData.license_document}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Document"
                                                >
                                                    <FaEye className="h-4 w-4" />
                                                </a>
                                                <button
                                                    onClick={removeLicenseDocument}
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove Document"
                                                >
                                                    <FaTrash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* New File Upload */}
                                {files.license_document && (
                                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <FaFileUpload className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">New License Document</p>
                                                    <p className="text-xs text-gray-500">
                                                        {files.license_document.name} ({(files.license_document.size / 1024 / 1024).toFixed(2)} MB)
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setFiles(prev => ({ ...prev, license_document: null }))}
                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove File"
                                            >
                                                <FaTimes className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                {!files.license_document && (
                                    <label className="block">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => handleFileChange(e, 'license_document')}
                                            className="hidden"
                                        />
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#00A55F] hover:bg-[#00A55F]/5 transition-colors cursor-pointer">
                                            <div className="p-3 bg-gray-100 rounded-lg inline-block mb-3">
                                                <FaFileUpload className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-700 mb-1">
                                                Upload License Document
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PDF, DOC, or DOCX files only (Max 10MB)
                                            </p>
                                        </div>
                                    </label>
                                )}

                                {/* Upload Info */}
                                <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <FaExclamationTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-xs text-blue-800">
                                            <p className="font-medium mb-1">License Document Requirements:</p>
                                            <ul className="space-y-1 text-blue-700">
                                                <li>• Business registration or trade license</li>
                                                <li>• Valid government-issued business permit</li>
                                                <li>• Company registration certificate</li>
                                                <li>• Maximum file size: 10MB</li>
                                                <li>• Supported formats: PDF, DOC, DOCX</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Organization Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter organization name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Industry
                                    </label>
                                    <select
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                    >
                                        <option value="">Select Industry</option>
                                        {industries.map((industry) => (
                                            <option key={industry} value={industry}>
                                                {industry}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Size
                                    </label>
                                    <select
                                        name="employee_range"
                                        value={formData.employee_range}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                    >
                                        <option value="">Select Company Size</option>
                                        {employeeRanges.map((range) => (
                                            <option key={range} value={range}>
                                                {range} employees
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Founded Year
                                    </label>
                                    <select
                                        name="founded_year"
                                        value={formData.founded_year}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                    >
                                        <option value="">Select Year</option>
                                        {foundedYears.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
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
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.website ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    {errors.website && (
                                        <p className="mt-1 text-sm text-red-500">{errors.website}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    About Organization
                                </label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleInputChange}
                                    rows="4"
                                    maxLength="500"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors resize-none"
                                    placeholder="Tell us about your organization, mission, and values..."
                                />
                                <div className="mt-1 text-xs text-gray-500 text-right">
                                    {formData.about.length}/500 characters
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaPhone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                            placeholder="+222 XXX XXX XXX"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="contact@company.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors resize-none"
                                    placeholder="Enter your company address..."
                                />
                            </div>
                        </motion.div>

                        {/* Social Media Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Social Media</h3>

                            {/* Verification Error Display */}
                            {errors.verification && (
                                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <FaExclamationTriangle className="h-4 w-4 text-red-500" />
                                        <p className="text-sm text-red-700">{errors.verification}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* LinkedIn */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaLinkedin className="h-4 w-4 text-blue-600" />
                                            <span>LinkedIn</span>
                                        </div>
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.social_links.linkedin}
                                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                        placeholder="https://linkedin.com/company/your-company"
                                    />
                                </div>

                                {/* Facebook */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaFacebook className="h-4 w-4 text-blue-600" />
                                            <span>Facebook</span>
                                        </div>
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.social_links.facebook}
                                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                        placeholder="https://facebook.com/your-company"
                                    />
                                </div>

                                {/* Instagram */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaInstagram className="h-4 w-4 text-pink-600" />
                                            <span>Instagram</span>
                                        </div>
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.social_links.instagram}
                                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                        placeholder="https://instagram.com/your-company"
                                    />
                                </div>
                            </div>

                            {/* Social Media Tips */}
                            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                        <FaGlobe className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-900 mb-1">Social Media Tips</h4>
                                        <ul className="text-xs text-blue-800 space-y-1">
                                            <li>• Use your company's official social media profiles</li>
                                            <li>• Ensure URLs are complete and accessible</li>
                                            <li>• Keep profiles updated and professional</li>
                                            <li>• These links will be visible to candidates</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-center justify-between">
                                <motion.button
                                    type="button"
                                    onClick={handleCancel}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors font-medium"
                                >
                                    Cancel
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={!hasChanges || isSaving}
                                    whileHover={{ scale: hasChanges && !isSaving ? 1.02 : 1 }}
                                    whileTap={{ scale: hasChanges && !isSaving ? 0.98 : 1 }}
                                    className={`
                                        px-8 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors font-medium 
                                        ${hasChanges && !isSaving
                                            ? 'bg-[#00A55F] hover:bg-[#008c4f]'
                                            : 'bg-gray-300 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    {isSaving ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
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
                        </motion.div>
                    </div>
                </div>
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
                            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
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
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveChanges}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#00A55F] rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors"
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