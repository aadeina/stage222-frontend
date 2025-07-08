import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaUniversity, FaCalendarAlt, FaFileAlt, FaCamera, FaCheck, FaArrowRight, FaArrowLeft, FaPlus, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { completeCandidateOnboarding } from '@/features/candidate/api/candidateApi';

const CandidateOnboarding = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: '',
        city: '',
        university: '',
        graduation_year: new Date().getFullYear(),
        degree: '',
        resume: null,
        profile_picture: null,
        skills: []
    });

    // Available skills for selection
    const availableSkills = [
        'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'C#', 'PHP',
        'HTML/CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
        'Git', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 'Spring Boot',
        'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Project Management',
        'Agile', 'Scrum', 'Communication', 'Leadership', 'Problem Solving',
        'Critical Thinking', 'Teamwork', 'Time Management', 'Creativity'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                [field]: file
            }));
        }
    };

    const handleSkillToggle = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const validateStep1 = () => {
        const required = ['first_name', 'last_name', 'phone', 'city', 'university', 'graduation_year', 'degree'];
        const missing = required.filter(field => !formData[field]);

        if (missing.length > 0) {
            toast.error(`Please fill in all required fields: ${missing.join(', ')}`);
            return false;
        }

        if (!formData.profile_picture) {
            toast.error('Please upload a profile picture');
            return false;
        }

        return true;
    };

    const validateStep2 = () => {
        if (formData.skills.length < 3) {
            toast.error('Please select at least 3 skills');
            return false;
        }

        if (!formData.resume) {
            toast.error('Please upload your resume');
            return false;
        }

        return true;
    };

    const nextStep = () => {
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 2 && !validateStep2()) return;

        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const formDataToSend = new FormData();

            // Add basic fields
            Object.keys(formData).forEach(key => {
                if (key !== 'resume' && key !== 'profile_picture' && key !== 'skills') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add files
            if (formData.profile_picture) {
                formDataToSend.append('profile_picture', formData.profile_picture);
            }
            if (formData.resume) {
                formDataToSend.append('resume', formData.resume);
            }

            // Add skills as JSON string
            formDataToSend.append('skills', JSON.stringify(formData.skills));

            const response = await completeCandidateOnboarding(formDataToSend);

            // Update user data
            updateUser(response.user);

            toast.success('Onboarding completed successfully!');
            navigate('/candidate/dashboard');

        } catch (error) {
            console.error('Onboarding error:', error);
            toast.error(error.response?.data?.message || 'Onboarding failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('candidateOnboarding.title')}
                    </h1>
                    <p className="text-gray-600">
                        {t('candidateOnboarding.subtitle')}
                    </p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-[#00A55F]' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'bg-[#00A55F] border-[#00A55F] text-white' : 'border-gray-300'}`}>
                                {currentStep > 1 ? <FaCheck className="w-4 h-4" /> : '1'}
                            </div>
                            <span className="font-medium">{t('candidateOnboarding.step1')}</span>
                        </div>
                        <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-[#00A55F]' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-[#00A55F]' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'bg-[#00A55F] border-[#00A55F] text-white' : 'border-gray-300'}`}>
                                {currentStep > 2 ? <FaCheck className="w-4 h-4" /> : '2'}
                            </div>
                            <span className="font-medium">{t('candidateOnboarding.step2')}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                                    <p className="text-gray-600">Tell us about yourself</p>
                                </div>

                                {/* Profile Picture Upload */}
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                            {formData.profile_picture ? (
                                                <img
                                                    src={URL.createObjectURL(formData.profile_picture)}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <FaCamera className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 bg-[#00A55F] text-white p-2 rounded-full cursor-pointer hover:bg-[#008c4f] transition-colors">
                                            <FaCamera className="w-4 h-4" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'profile_picture')}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Upload your profile picture</p>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaUser className="inline w-4 h-4 mr-2" />
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-colors"
                                            placeholder="Enter your first name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaUser className="inline w-4 h-4 mr-2" />
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-colors"
                                            placeholder="Enter your last name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaPhone className="inline w-4 h-4 mr-2" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-colors"
                                            placeholder="+22248123456"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaMapMarkerAlt className="inline w-4 h-4 mr-2" />
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-colors"
                                            placeholder="e.g., Nouakchott"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaUniversity className="inline w-4 h-4 mr-2" />
                                            University *
                                        </label>
                                        <input
                                            type="text"
                                            name="university"
                                            value={formData.university}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-colors"
                                            placeholder="e.g., ISCAE Nouakchott"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaGraduationCap className="inline w-4 h-4 mr-2" />
                                            Degree *
                                        </label>
                                        <input
                                            type="text"
                                            name="degree"
                                            value={formData.degree}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-colors"
                                            placeholder="e.g., Computer Science"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaCalendarAlt className="inline w-4 h-4 mr-2" />
                                            Graduation Year *
                                        </label>
                                        <select
                                            name="graduation_year"
                                            value={formData.graduation_year}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] transition-colors"
                                        >
                                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills & Resume</h2>
                                    <p className="text-gray-600">Showcase your expertise</p>
                                </div>

                                {/* Resume Upload */}
                                <div className="text-center">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-[#00A55F] transition-colors">
                                        <FaFileAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        {formData.resume ? (
                                            <div>
                                                <p className="text-sm text-gray-600 mb-2">Resume uploaded: {formData.resume.name}</p>
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    <FaTimes className="inline w-4 h-4 mr-1" />
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-gray-600 mb-2">Upload your resume (PDF, DOC, DOCX)</p>
                                                <label className="bg-[#00A55F] text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-[#008c4f] transition-colors">
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={(e) => handleFileChange(e, 'resume')}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Skills Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Select your skills (minimum 3) *
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {availableSkills.map(skill => (
                                            <motion.button
                                                key={skill}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleSkillToggle(skill)}
                                                className={`p-3 rounded-lg border-2 transition-all ${formData.skills.includes(skill)
                                                    ? 'border-[#00A55F] bg-[#00A55F] text-white'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:border-[#00A55F] hover:bg-[#00A55F]/5'
                                                    }`}
                                            >
                                                {skill}
                                            </motion.button>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Selected: {formData.skills.length} skills
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${currentStep === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={nextStep}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-6 py-3 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{currentStep === 2 ? (isLoading ? 'Completing...' : 'Complete Setup') : 'Next'}</span>
                            {currentStep === 2 ? null : <FaArrowRight className="w-4 h-4" />}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CandidateOnboarding; 