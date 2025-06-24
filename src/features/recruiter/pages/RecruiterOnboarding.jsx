import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { submitRecruiterOnboarding } from '../api/onboardingApi';
import { sendOtp, verifyRecruiterOtp } from '../../../services/authApi';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { createOrganization, updateOrganization } from '@/services/organizationApi';

const RecruiterOnboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
    const [industrySearch, setIndustrySearch] = useState('');
    const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
    const [designationSearch, setDesignationSearch] = useState('');
    const [showCustomDesignation, setShowCustomDesignation] = useState(false);
    const [customDesignation, setCustomDesignation] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Personal Details
        firstName: '',
        lastName: '',
        email: '',
        designation: '',
        phone: '',
        // Step 2: Organization Details
        orgName: '',
        isFreelancer: false,
        about: '',
        city: '',
        industry: '',
        employeeCount: '',
        website: '',
        logo: null,
        licenseFile: null,
        socialMediaUrls: '',
        organization_id: null,
        verificationType: '',
    });
    const [errors, setErrors] = useState({});
    const [otpTimer, setOtpTimer] = useState(0);
    const [canResendOtp, setCanResendOtp] = useState(false);
    const [isOrgVerified, setIsOrgVerified] = useState(false);
    const [organizationCreated, setOrganizationCreated] = useState(false);

    // Facebook-style blue badge logic
    const isFullyVerified =
        !!formData.licenseFile &&
        !!formData.website &&
        !!formData.socialMediaUrls &&
        formData.socialMediaUrls.split(',').filter(Boolean).length > 0;

    const steps = [
        {
            number: 1,
            title: 'Personal Details',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            description: 'Tell us about yourself'
        },
        {
            number: 2,
            title: 'Organization Details',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            description: 'Company information'
        },
        {
            number: 3,
            title: 'Post Internship/Job',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            description: 'Final setup'
        }
    ];

    const mauritanianCities = [
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

    const designations = [
        "Hiring Manager",
        "Recruiter",
        "Talent Acquisition Specialist",
        "HR Manager",
        "Founder",
        "Co-Founder",
        "CEO",
        "CTO",
        "COO",
        "Managing Director",
        "Technical Recruiter",
        "HR Executive",
        "Operations Manager",
        "Administrative Officer",
        "Marketing Manager",
        "Team Lead",
        "Engineering Manager",
        "Product Manager"
    ];

    const validateStep = (step) => {
        const newErrors = {};
        switch (step) {
            case 1:
                if (!formData.firstName) newErrors.firstName = 'First name is required';
                if (!formData.lastName) newErrors.lastName = 'Last name is required';
                if (!formData.email) newErrors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
                if (!formData.designation) newErrors.designation = 'Designation is required';
                if (!formData.phone) newErrors.phone = 'Phone number is required';
                else if (!/^\d{8}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 8 digits';
                if (!phoneVerified) newErrors.phone = 'Please verify your phone number first';
                break;
            case 2:
                if (!formData.orgName) newErrors.orgName = 'Organization name is required';
                if (!formData.about) newErrors.about = 'About is required';
                if (!formData.city) newErrors.city = 'City is required';
                if (!formData.industry) newErrors.industry = 'Industry is required';
                if (!formData.employeeCount) newErrors.employeeCount = 'Employee range is required';
                if (!formData.website) newErrors.website = 'Website is required';
                if (!formData.logo) newErrors.logo = 'Company logo is required';
                // Verification method: at least one
                const hasLicenseFile = !!formData.licenseFile;
                const hasWebsite = !!formData.website;
                const hasSocialMediaLinks = !!(formData.socialMediaUrls && formData.socialMediaUrls.split(',').filter(Boolean).length > 0);
                if (!hasLicenseFile && !hasWebsite && !hasSocialMediaLinks) {
                    newErrors.verification = 'Please complete at least one verification method (license, website, or social media).';
                }
                break;
            case 3:
                if (!formData.logo) newErrors.logo = 'Company logo is required';
                break;
        }
        setErrors(newErrors);
        console.log('Validation errors:', newErrors, formData);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                logo: file
            }));
            if (errors.logo) {
                setErrors(prev => ({
                    ...prev,
                    logo: ''
                }));
            }
        }
    };

    const handleNext = async () => {
        if (currentStep === 2 && !organizationCreated) {
            const isValid = validateStep(2);
            if (!isValid) return;
            setIsLoading(true);
            try {
                const form = new FormData();
                form.append('name', formData.orgName);
                form.append('is_independent', formData.isFreelancer);
                form.append('about', formData.about || '');
                form.append('city', formData.city || '');
                form.append('industry', formData.industry || '');
                form.append('employee_range', formData.employeeCount || '');
                form.append('website', formData.website || '');
                if (formData.logo) form.append('logo', formData.logo);
                if (formData.licenseFile) form.append('license_document', formData.licenseFile);
                const socialLinksArray = formData.socialMediaUrls
                    ? formData.socialMediaUrls.split(',').filter(url => url.trim() !== '')
                    : [];
                form.append('social_links', JSON.stringify(socialLinksArray));
                const response = await createOrganization(form);
                if (response.data?.data?.id) {
                    setFormData(prev => ({ ...prev, organization_id: response.data.data.id }));
                }
                setOrganizationCreated(true);
                toast.success('✅ Organization created!');
                setCurrentStep(3);
            } catch (err) {
                console.error('Failed to create organization:', err);
                const errorMessage = err.response?.data?.message || "Couldn't create organization. Please try again.";
                toast.error(errorMessage);
                if (err.response?.data?.errors) {
                    setErrors(prev => ({ ...prev, ...err.response.data.errors }));
                }
            } finally {
                setIsLoading(false);
            }
        } else if (currentStep === 3) {
            // After posting job/internship, redirect to setup complete
            navigate('/recruiter/onboarding/setup-complete');
        } else {
            if (validateStep(currentStep)) {
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    // const handleSubmit = async () => {
    //     if (!validateStep(currentStep)) return;

    //     setIsLoading(true);
    //     try {
    //         const formDataToSend = new FormData();
    //         Object.keys(formData).forEach(key => {
    //             formDataToSend.append(key, formData[key]);
    //         });

    //         await submitRecruiterOnboarding(formDataToSend);
    //         toast.success('Onboarding completed successfully!');
    //         navigate('/recruiter/post-opportunity');
    //     } catch (error) {
    //         console.error('Onboarding error:', error);
    //         toast.error(error.response?.data?.message || 'Failed to complete onboarding');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    const handleSubmit = async () => {
  setIsLoading(true);
  try {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    await submitRecruiterOnboarding(formDataToSend); // ✅ sends to working endpoint

    toast.success('Onboarding completed!');
    navigate('/recruiter/post-opportunity'); // ✅ go to next step
  } catch (error) {
    toast.error(error.response?.data?.message || 'Onboarding failed');
  } finally {
    setIsLoading(false);
  }
};

    // Add timer effect for OTP resend
    useEffect(() => {
        let interval;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => {
                    if (prev <= 1) {
                        setCanResendOtp(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    const handleSendOtp = async () => {
        if (!formData.phone || !/^\d{8}$/.test(formData.phone)) {
            setErrors(prev => ({ ...prev, phone: 'Please enter a valid 8-digit phone number' }));
            return;
        }

        setIsSendingOtp(true);
        try {
            await sendOtp(formData.phone);
            setShowOtpField(true);
            setOtpTimer(60); // 60 seconds timer
            setCanResendOtp(false);
            toast.success('OTP sent successfully!');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setIsVerifyingOtp(true);
        try {
            await verifyRecruiterOtp(formData.phone, otp);
            setPhoneVerified(true);
            toast.success('Phone number verified successfully!');
            // Automatically proceed to next step after successful verification
            setCurrentStep(2);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Invalid OTP');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setOtp(value);
    };

    const handleIndustryToggle = (industry) => {
        const currentIndustries = formData.industry ? formData.industry.split(',') : [];
        const newIndustries = currentIndustries.includes(industry)
            ? currentIndustries.filter(i => i !== industry)
            : currentIndustries.length < 5
                ? [...currentIndustries, industry]
                : currentIndustries;

        setFormData(prev => ({
            ...prev,
            industry: newIndustries.join(',')
        }));
    };

    const handleCitySelect = (city) => {
        setFormData(prev => ({
            ...prev,
            city
        }));
        setShowCityDropdown(false);
    };

    const handleEmployeeRangeSelect = (range) => {
        setFormData(prev => ({
            ...prev,
            employeeCount: range
        }));
        setShowEmployeeDropdown(false);
    };

    const handleSocialMediaAdd = () => {
        const currentLinks = formData.socialMediaUrls ? formData.socialMediaUrls.split(',') : [];
        if (currentLinks.length < 3) {
            setFormData(prev => ({
                ...prev,
                socialMediaUrls: [...currentLinks, ''].join(',')
            }));
        }
    };

    const handleSocialMediaRemove = (index) => {
        const currentLinks = formData.socialMediaUrls ? formData.socialMediaUrls.split(',') : [];
        const newLinks = currentLinks.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            socialMediaUrls: newLinks.join(',')
        }));
    };

    const handleSocialMediaChange = (index, value) => {
        const currentLinks = formData.socialMediaUrls ? formData.socialMediaUrls.split(',') : [];
        currentLinks[index] = value;
        setFormData(prev => ({
            ...prev,
            socialMediaUrls: currentLinks.join(',')
        }));
    };

    const filteredIndustries = industries.filter(industry =>
        !(formData.industry || '').split(',').includes(industry) &&
        industry.toLowerCase().includes(industrySearch.toLowerCase())
    );

    const selectedIndustries = (formData.industry || '').split(',').filter(Boolean);
    const hasReachedLimit = selectedIndustries.length >= 5;

    const handleDesignationChange = (e) => {
        const value = e.target.value;
        setDesignationSearch(value);
        setShowDesignationDropdown(true);
        setIsTyping(true);

        // Check if the value matches any designation
        const matches = designations.some(d =>
            d.toLowerCase().includes(value.toLowerCase())
        );

        if (!matches && value) {
            setShowCustomDesignation(true);
            setSelectedDesignation(null);
        } else {
            setShowCustomDesignation(false);
        }
    };

    const handleDesignationSelect = (designation) => {
        setSelectedDesignation(designation);
        setFormData(prev => ({
            ...prev,
            designation
        }));
        setDesignationSearch(designation);
        setShowDesignationDropdown(false);
        setShowCustomDesignation(false);
        setIsTyping(false);
    };

    const handleCustomDesignationChange = (e) => {
        const value = e.target.value;
        setCustomDesignation(value);
        setFormData(prev => ({
            ...prev,
            designation: value
        }));
    };

    const handleDesignationBlur = () => {
        // Small delay to allow for click events on dropdown items
        setTimeout(() => {
            setShowDesignationDropdown(false);
            setIsTyping(false);
        }, 200);
    };

    // Add click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDesignationDropdown && !event.target.closest('.designation-dropdown')) {
                setShowDesignationDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDesignationDropdown]);

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        {steps.map((step) => (
                            <div key={step.number} className="flex items-center w-full sm:w-auto">
                                <motion.div
                                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${currentStep >= step.number
                                        ? 'bg-[#00A55F] text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                    animate={{
                                        scale: currentStep === step.number ? [1, 1.1, 1] : 1,
                                        transition: { duration: 0.5 }
                                    }}
                                >
                                    {step.icon}
                                </motion.div>
                                <div className="ml-3 flex-1 sm:flex-none">
                                    <div className="text-sm font-medium text-gray-900">
                                        {step.title}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {step.description}
                                    </div>
                                </div>
                                {step.number < steps.length && (
                                    <div
                                        className={`hidden sm:block w-12 md:w-24 h-1 mx-2 md:mx-4 ${currentStep > step.number
                                            ? 'bg-[#00A55F]'
                                            : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
                >
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4 sm:space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Designation
                                    </label>
                                    <div className="relative designation-dropdown">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={designationSearch}
                                                onChange={handleDesignationChange}
                                                onFocus={() => setShowDesignationDropdown(true)}
                                                onBlur={handleDesignationBlur}
                                                placeholder="Select or type your designation"
                                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.designation ? 'border-red-500' : 'border-gray-300'
                                                    } ${selectedDesignation ? 'bg-gray-50' : ''}`}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <svg
                                                    className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${showDesignationDropdown ? 'rotate-180' : ''
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {showDesignationDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                                            >
                                                <div className="p-2">
                                                    <div className="max-h-60 overflow-y-auto">
                                                        {designations
                                                            .filter(d => d.toLowerCase().includes(designationSearch.toLowerCase()))
                                                            .map((designation) => (
                                                                <button
                                                                    key={designation}
                                                                    type="button"
                                                                    onClick={() => handleDesignationSelect(designation)}
                                                                    className={`w-full px-4 py-2.5 text-left text-sm rounded-md transition-colors ${selectedDesignation === designation
                                                                        ? 'bg-[#00A55F] text-white'
                                                                        : 'text-gray-700 hover:bg-gray-50'
                                                                        }`}
                                                                >
                                                                    {designation}
                                                                </button>
                                                            ))}
                                                        {designations.filter(d =>
                                                            d.toLowerCase().includes(designationSearch.toLowerCase())
                                                        ).length === 0 && designationSearch && (
                                                                <motion.div
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    className="px-4 py-2.5 text-sm text-gray-500"
                                                                >
                                                                    Designation not found. I'll specify
                                                                </motion.div>
                                                            )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {showCustomDesignation && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-2"
                                        >
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Specify the designation (e.g. Senior Hiring Manager)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={customDesignation}
                                                    onChange={handleCustomDesignationChange}
                                                    placeholder="Enter your designation"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                                />
                                                {customDesignation && (
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCustomDesignation('');
                                                                setFormData(prev => ({ ...prev, designation: '' }));
                                                                setShowCustomDesignation(false);
                                                            }}
                                                            className="text-gray-400 hover:text-gray-500"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                    {errors.designation && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1 text-sm text-red-500"
                                        >
                                            {errors.designation}
                                        </motion.p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value="+222"
                                                disabled
                                                className="w-16 sm:w-20 px-4 py-2.5 border border-gray-300 bg-gray-50 text-gray-500 rounded-lg"
                                            />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Enter your phone number"
                                                className={`flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={isSendingOtp || !formData.phone || !/^\d{8}$/.test(formData.phone)}
                                            className="w-full sm:w-auto px-4 py-2.5 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSendingOtp ? (
                                                <div className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </div>
                                            ) : (
                                                'Verify'
                                            )}
                                        </button>
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                    )}
                                </div>

                                {showOtpField && !phoneVerified && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600">
                                                OTP sent to your mobile. Valid for 10 minutes.
                                            </p>
                                            {otpTimer > 0 ? (
                                                <span className="text-sm text-gray-500">
                                                    Resend in {otpTimer}s
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                    disabled={!canResendOtp}
                                                    className="text-sm text-[#00A55F] hover:text-[#008c4f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={handleOtpChange}
                                                placeholder="Enter 6-digit OTP"
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={isVerifyingOtp || !otp || otp.length !== 6}
                                                className="w-full sm:w-auto px-4 py-2.5 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isVerifyingOtp ? (
                                                    <div className="flex items-center justify-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Verifying...
                                                    </div>
                                                ) : (
                                                    'Submit OTP'
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {phoneVerified && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center text-sm text-[#00A55F]"
                                    >
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Phone number verified
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Organization Details Section */}
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h2>

                                        {/* Organization Name */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Organization Name
                                            </label>
                                            <input
                                                type="text"
                                                name="orgName"
                                                value={formData.orgName}
                                                onChange={handleChange}
                                                placeholder="e.g., Amar Med"
                                                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.orgName ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.orgName && (
                                                <p className="mt-1 text-sm text-red-500">{errors.orgName}</p>
                                            )}
                                        </div>

                                        {/* Logo Upload Field (moved here) */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Logo
                                            </label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                                <div className="space-y-1 text-center">
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label
                                                            htmlFor="logo-upload"
                                                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#00A55F] hover:text-[#008c4f] focus-within:outline-none"
                                                        >
                                                            <span>Upload a file</span>
                                                            <input
                                                                id="logo-upload"
                                                                name="logo"
                                                                type="file"
                                                                accept="image/*"
                                                                className="sr-only"
                                                                onChange={handleLogoChange}
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                            </div>
                                            {formData.logo && (
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Selected file: {formData.logo.name}
                                                </p>
                                            )}
                                            {errors.logo && (
                                                <p className="mt-1 text-sm text-red-500">{errors.logo}</p>
                                            )}
                                        </div>

                                        {/* Freelancer Checkbox */}
                                        <div className="mb-6">
                                            <label className="flex items-start space-x-3">
                                                <input
                                                    type="checkbox"
                                                    name="isFreelancer"
                                                    checked={formData.isFreelancer}
                                                    onChange={handleChange}
                                                    className="mt-1 h-4 w-4 text-[#00A55F] border-gray-300 rounded focus:ring-[#00A55F]"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    I am an independent practitioner (freelancer, architect, lawyer etc.) hiring for myself and NOT on behalf of a company.
                                                </span>
                                            </label>
                                        </div>

                                        {/* About Section */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                About Yourself
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    name="about"
                                                    value={formData.about}
                                                    onChange={handleChange}
                                                    rows="4"
                                                    maxLength="500"
                                                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors resize-none ${errors.about ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                                                    {500 - (formData.about?.length || 0)} characters left
                                                </div>
                                            </div>
                                        </div>

                                        {/* City */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                                                    className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F]"
                                                >
                                                    <span className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-700">
                                                            {formData.city || 'Select a city'}
                                                        </span>
                                                        <svg
                                                            className={`w-5 h-5 text-gray-400 transform transition-transform ${showCityDropdown ? 'rotate-180' : ''
                                                                }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </span>
                                                </button>

                                                {showCityDropdown && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                                        <div className="p-2">
                                                            <div className="max-h-60 overflow-y-auto">
                                                                {mauritanianCities.map((city) => (
                                                                    <button
                                                                        key={city}
                                                                        type="button"
                                                                        onClick={() => handleCitySelect(city)}
                                                                        className={`w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${formData.city === city
                                                                            ? 'bg-[#00A55F] text-white'
                                                                            : 'text-gray-700 hover:bg-gray-100'
                                                                            }`}
                                                                    >
                                                                        {city}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.city && (
                                                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                                            )}
                                        </div>

                                        {/* Industry Selection */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Industry
                                            </label>
                                            <div className="space-y-2">
                                                {/* Selected Industries Tags */}
                                                {selectedIndustries.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedIndustries.map((industry) => (
                                                            <span
                                                                key={industry}
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#00A55F] text-white"
                                                            >
                                                                {industry}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleIndustryToggle(industry)}
                                                                    className="ml-2 hover:text-gray-200 focus:outline-none"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Dropdown */}
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => !hasReachedLimit && setShowIndustryDropdown(!showIndustryDropdown)}
                                                        className={`w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] ${hasReachedLimit ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        <span className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-700">
                                                                {selectedIndustries.length > 0
                                                                    ? 'Select industry'
                                                                    : 'Select industries'}
                                                            </span>
                                                            <svg
                                                                className={`w-5 h-5 text-gray-400 transform transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M19 9l-7 7-7-7"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </button>

                                                    {showIndustryDropdown && !hasReachedLimit && (
                                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                                            <div className="p-2">
                                                                {/* Search Input */}
                                                                <div className="relative mb-2">
                                                                    <input
                                                                        type="text"
                                                                        value={industrySearch}
                                                                        onChange={(e) => setIndustrySearch(e.target.value)}
                                                                        placeholder="Search industries..."
                                                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                                                    />
                                                                    <svg
                                                                        className="absolute left-2 top-2.5 h-5 w-5 text-gray-400"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                        />
                                                                    </svg>
                                                                </div>

                                                                <div className="max-h-60 overflow-y-auto">
                                                                    {filteredIndustries.map((industry) => (
                                                                        <button
                                                                            key={industry}
                                                                            type="button"
                                                                            onClick={() => handleIndustryToggle(industry)}
                                                                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                                        >
                                                                            {industry}
                                                                        </button>
                                                                    ))}
                                                                    {filteredIndustries.length === 0 && (
                                                                        <div className="px-3 py-2 text-sm text-gray-500">
                                                                            No matching industries found
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {hasReachedLimit && (
                                                    <p className="text-sm text-red-500">
                                                        You can select up to 5 industries
                                                    </p>
                                                )}

                                                {errors.industry && (
                                                    <p className="text-sm text-red-500">{errors.industry}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Number of Employees */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Number of Employees
                                            </label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                                                    className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F]"
                                                >
                                                    <span className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-700">
                                                            {formData.employeeCount || 'Select range'}
                                                        </span>
                                                        <svg
                                                            className={`w-5 h-5 text-gray-400 transform transition-transform ${showEmployeeDropdown ? 'rotate-180' : ''
                                                                }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </span>
                                                </button>

                                                {showEmployeeDropdown && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                                        <div className="p-2">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {employeeRanges.map((range) => (
                                                                    <button
                                                                        key={range}
                                                                        type="button"
                                                                        onClick={() => handleEmployeeRangeSelect(range)}
                                                                        className={`px-3 py-2 text-left text-sm rounded-md transition-colors ${formData.employeeCount === range
                                                                            ? 'bg-[#00A55F] text-white'
                                                                            : 'text-gray-700 hover:bg-gray-100'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            {formData.employeeCount === range && (
                                                                                <svg
                                                                                    className="w-4 h-4 mr-2"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    viewBox="0 0 24 24"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth="2"
                                                                                        d="M5 13l4 4L19 7"
                                                                                    />
                                                                                </svg>
                                                                            )}
                                                                            {range}
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.employeeCount && (
                                                <p className="mt-1 text-sm text-red-500">{errors.employeeCount}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Account Verification Section */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">Account Verification</h2>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Get your organization verified to start posting internships/jobs
                                                </p>
                                            </div>
                                            <div className="flex items-center text-sm text-blue-600">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Why verify?
                                            </div>
                                        </div>

                                        {/* Verified Badge */}
                                        {isOrgVerified && (
                                            <div className="mb-4 flex items-center gap-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-white font-semibold text-sm">
                                                    <svg className="w-4 h-4 mr-1 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <circle cx="10" cy="10" r="10" fill="#2563eb" />
                                                        <path fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 10.5l3 3 5-5" />
                                                    </svg>
                                                    Verified Badge
                                                </span>
                                                <span className="text-xs text-gray-500">(Organization is verified)</span>
                                            </div>
                                        )}

                                        {/* Error for verification */}
                                        {errors.verification && (
                                            <div className="mb-4 text-sm text-red-500 font-medium">{errors.verification}</div>
                                        )}

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-blue-700">
                                                        Choose one of the following verification methods to get started. This helps us ensure the authenticity of organizations on our platform.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Business License Option */}
                                            <label className={`flex items-start space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${formData.verificationType === 'license'
                                                ? 'border-[#00A55F] ring-2 ring-[#00A55F] bg-green-50'
                                                : 'hover:border-[#00A55F]'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="verificationType"
                                                    value="license"
                                                    checked={formData.verificationType === 'license'}
                                                    onChange={handleChange}
                                                    className="mt-1 h-4 w-4 text-[#00A55F] border-gray-300 focus:ring-[#00A55F]"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center">
                                                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            Business License
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-500">
                                                        Upload a government-issued document (PDF or Image)
                                                    </div>
                                                    {formData.verificationType === 'license' && (
                                                        <div className="mt-3">
                                                            <div className="flex items-center justify-center w-full">
                                                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                        <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                        </svg>
                                                                        <p className="mb-2 text-sm text-gray-500">
                                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 10MB)</p>
                                                                    </div>
                                                                    <input
                                                                        type="file"
                                                                        name="licenseFile"
                                                                        onChange={handleChange}
                                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                                        className="hidden"
                                                                    />
                                                                </label>
                                                            </div>
                                                            {formData.licenseFile && (
                                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    {formData.licenseFile.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </label>

                                            {/* Website Option */}
                                            <label className={`flex items-start space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${formData.verificationType === 'website'
                                                ? 'border-[#00A55F] ring-2 ring-[#00A55F] bg-green-50'
                                                : 'hover:border-[#00A55F]'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="verificationType"
                                                    value="website"
                                                    checked={formData.verificationType === 'website'}
                                                    onChange={handleChange}
                                                    className="mt-1 h-4 w-4 text-[#00A55F] border-gray-300 focus:ring-[#00A55F]"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center">
                                                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                        </svg>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            Active Website
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-500">
                                                        Enter your company website URL
                                                    </div>
                                                    {formData.verificationType === 'website' && (
                                                        <div className="mt-3">
                                                            <div className="relative rounded-md shadow-sm">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                                    </svg>
                                                                </div>
                                                                <input
                                                                    type="url"
                                                                    name="website"
                                                                    value={formData.website}
                                                                    onChange={handleChange}
                                                                    placeholder="https://example.com"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </label>

                                            {/* Social Media Option */}
                                            <label className={`flex items-start space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${formData.verificationType === 'social'
                                                ? 'border-[#00A55F] ring-2 ring-[#00A55F] bg-green-50'
                                                : 'hover:border-[#00A55F]'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="verificationType"
                                                    value="social"
                                                    checked={formData.verificationType === 'social'}
                                                    onChange={handleChange}
                                                    className="mt-1 h-4 w-4 text-[#00A55F] border-gray-300 focus:ring-[#00A55F]"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center">
                                                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                                        </svg>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            Social Media Pages
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-500">
                                                        Add up to 3 public pages (LinkedIn, Facebook, Instagram, etc.) with at least 1000 followers
                                                    </div>
                                                    {formData.verificationType === 'social' && (
                                                        <div className="mt-3 space-y-3">
                                                            {(formData.socialMediaUrls || '').split(',').map((url, index) => (
                                                                <div key={index} className="flex gap-2">
                                                                    <div className="relative flex-1">
                                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                                            </svg>
                                                                        </div>
                                                                        <input
                                                                            type="url"
                                                                            value={url}
                                                                            onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                                                                            placeholder="https://linkedin.com/company/..."
                                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSocialMediaRemove(index)}
                                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors"
                                                                    >
                                                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            {(formData.socialMediaUrls || '').split(',').length < 3 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={handleSocialMediaAdd}
                                                                    className="inline-flex items-center text-sm text-[#00A55F] hover:text-[#008c4f]"
                                                                >
                                                                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                    </svg>
                                                                    Add another link
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        </div>

                                        {/* Help Text */}
                                        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                                            <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Need help? Contact Stage222 support via WhatsApp at +222 35 00 00 00 (Mon–Fri, 9AM–5PM)
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Information</h3>
                                    <dl className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                                            <dd className="text-sm text-gray-900">{formData.firstName} {formData.lastName}</dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="text-sm text-gray-900">{formData.email}</dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Designation</dt>
                                            <dd className="text-sm text-gray-900">{formData.designation}</dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Organization</dt>
                                            <dd className="text-sm text-gray-900">{formData.orgName}</dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Industry</dt>
                                            <dd className="text-sm text-gray-900">{formData.industry}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between gap-4 sm:gap-0">
                        {currentStep > 1 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleBack}
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors"
                            >
                                Back
                            </motion.button>
                        )}
                        <div className="flex-1" />
                        {currentStep < steps.length ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleNext}
                                disabled={isLoading}
                                className="w-full sm:w-auto px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] transition-colors"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : currentStep === 2 && !organizationCreated ? (
                                    'Create Organization'
                                ) : currentStep === 3 ? (
                                    'Post Internship/Job'
                                ) : (
                                    'Next'
                                )}
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full sm:w-auto px-4 py-2 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </div>
                                ) : (
                                    'Complete Onboarding Next'
                                )}
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RecruiterOnboarding; 