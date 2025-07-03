import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getCandidateProfile, updateCandidateProfile, updateCandidateResume, updateCandidateSkills, getAllSkills, deleteCandidateSkill, updateCandidateProfilePicture } from '../api/candidateApi';
import SkillBadge from '@/components/ui/SkillBadge';
import { FaUser, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaUniversity, FaCalendarAlt, FaFileAlt, FaCamera, FaCheck, FaPlus, FaTimes, FaStar, FaSearch, FaChevronDown } from 'react-icons/fa';
import stage222Logo from '@/assets/images/MainStage222Logo.png';
import clsx from 'clsx';
import { useAuth } from '../../../context/AuthContext';
import getMediaUrl from '../../../utils/mediaUrl';



// Backend-compatible Mauritanian cities (value, label)
const mauritanianCities = [
    { value: 'Nouakchott', label: 'Nouakchott' },
    { value: 'Nouadhibou', label: 'Nouadhibou' },
    { value: 'Zouerate', label: 'Zouerate' },
    { value: 'Rosso', label: 'Rosso' },
    { value: 'Kiffa', label: 'Kiffa' },
    { value: 'Atar', label: 'Atar' },
    { value: 'Aleg', label: 'Aleg' },
    { value: 'Tidjikja', label: 'Tidjikja' },
    { value: 'Kaedi', label: 'Kaédi' },
    { value: 'Néma', label: 'Néma' },
    { value: 'Selibaby', label: 'Sélibaby' },
];



const CandidateEditProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [skillInput, setSkillInput] = useState('');
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [allSkills, setAllSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isChanged, setIsChanged] = useState(false);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [errors, setErrors] = useState({});
    const [profilePicFile, setProfilePicFile] = useState(null);
    const { updateUser } = useAuth();
    const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
    const [isLoadingSkills, setIsLoadingSkills] = useState(false);
    const [isLoadingProfilePicture, setIsLoadingProfilePicture] = useState(false);

    // Fetch profile and skills on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch profile and skills in parallel
                const [profileData, skillsResponse] = await Promise.all([
                    getCandidateProfile(),
                    getAllSkills()
                ]);

                setProfile(profileData);
                // Extract the results array from the paginated response
                setAllSkills(skillsResponse.results || []);

                setFormData({
                    first_name: profileData.first_name || '',
                    last_name: profileData.last_name || '',
                    phone: profileData.phone || '',
                    city: profileData.city || '',
                    university: profileData.university || '',
                    graduation_year: profileData.graduation_year || new Date().getFullYear(),
                    degree: profileData.degree || '',
                    resume: profileData.resume || null,
                    profile_picture: profileData.profile_picture || null,
                    skills: profileData.skills || [] // Backend returns array of {id, name} objects
                });

                setIsLoading(false);
                setProfileCompletion(calculateProfileCompletion(profileData));
            } catch (err) {
                console.error('Error fetching data:', err);
                toast.error('Failed to load profile data');
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate profile completion
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

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsChanged(true);
    };

    // Handle resume upload
    const handleResumeChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await updateCandidateResume(file);
                setResumeFile(file);
                setFormData(prev => ({ ...prev, resume: file }));
                setIsChanged(true);
                toast.success('Resume updated successfully!');
            } catch (err) {
                toast.error('Failed to update resume');
            }
        }
    };

    // Update skill search to work with skill objects from backend
    useEffect(() => {
        if (skillInput.trim() === '') {
            setFilteredSkills([]);
        } else {
            const currentSkillIds = formData?.skills?.map(skill => skill.id) || [];
            const filtered = allSkills.filter(skill =>
                skill.name.toLowerCase().includes(skillInput.toLowerCase()) &&
                !currentSkillIds.includes(skill.id)
            ).slice(0, 10); // Limit to 10 suggestions for better UX

            console.log('Skill search debug:', {
                input: skillInput,
                allSkillsCount: allSkills.length,
                currentSkillIds,
                filteredCount: filtered.length,
                filtered: filtered.slice(0, 3) // Show first 3 for debugging
            });

            setFilteredSkills(filtered);
        }
    }, [skillInput, formData?.skills, allSkills]);

    // Add skill
    const handleAddSkill = (skill) => {
        const currentSkillIds = formData.skills.map(s => s.id);
        if (!currentSkillIds.includes(skill.id)) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
            setSkillInput('');
            setIsChanged(true);
            toast.success(`${skill.name} added to your skills!`);
        } else {
            toast.error(`${skill.name} is already in your skills list`);
        }
    };

    // Remove skill
    const handleRemoveSkill = async (skill) => {
        try {
            await deleteCandidateSkill(skill.name);
            setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skill.id) }));
            setIsChanged(true);
            toast.success(`${skill.name} removed from your skills!`);
        } catch (err) {
            toast.error('Failed to remove skill');
        }
    };

    // Update skills on backend
    const handleSkillsUpdate = async () => {
        try {
            setIsLoadingSkills(true);
            const skillIds = formData.skills.map(skill => skill.id);
            await updateCandidateSkills(skillIds);
            toast.success('Skills updated successfully!');
            setIsChanged(false);
        } catch (err) {
            toast.error('Failed to update skills');
        } finally {
            setIsLoadingSkills(false);
        }
    };

    // Phone validation
    function isValidPhone(phone) {
        return /^\+222[234]\d{6,}$/.test(phone);
    }

    // Profile picture validation
    function isFile(obj) {
        return obj instanceof File;
    }

    // Handle profile picture upload
    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            setFormData(prev => ({ ...prev, profile_picture: file }));
            setIsChanged(true);
        }
    };

    // Handle profile picture update
    const handleProfilePictureUpdate = async () => {
        if (!profilePicFile) {
            toast.error('Please select a profile picture first');
            return;
        }

        try {
            setIsLoadingProfilePicture(true);

            // Upload the profile picture
            await updateCandidateProfilePicture(profilePicFile);

            // Wait a moment for the backend to process the upload
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Re-fetch profile to get updated data with new image URL
            const updated = await getCandidateProfile();
            console.log('Updated profile data:', updated);

            setProfile(updated);

            // Update form data with the URL from backend, not the file object
            setFormData(prev => ({
                ...prev,
                profile_picture: updated.profile_picture
            }));

            // Clear the file state since we now have the URL
            setProfilePicFile(null);

            console.log('Profile picture updated:', {
                profilePicture: updated.profile_picture,
                userContext: updated
            });

            toast.success('Profile picture updated successfully!');
            setIsChanged(false);
            updateUser(updated);
        } catch (err) {
            console.error('Profile picture update error:', err);
            toast.error('Failed to update profile picture');
        } finally {
            setIsLoadingProfilePicture(false);
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        if (!isValidPhone(formData.phone)) {
            newErrors.phone = 'Enter a valid Mauritanian number starting with +2222, +2223, or +2224.';
        }
        if (profilePicFile && !(profilePicFile instanceof File)) {
            newErrors.profile_picture = 'The submitted data was not a file. Check the encoding type on the form.';
        }
        if (!mauritanianCities.some(city => city.value === formData.city)) {
            newErrors.city = 'Please select a valid Mauritanian city.';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'resume' && key !== 'skills' && key !== 'profile_picture') {
                    formDataToSend.append(key, formData[key]);
                }
            });
            if (profilePicFile instanceof File) {
                formDataToSend.append('profile_picture', profilePicFile);
            }
            if (resumeFile) {
                formDataToSend.append('resume', resumeFile);
            }
            // Skills are handled separately via the dedicated skills endpoint
            await updateCandidateProfile(formDataToSend);

            // Update skills separately using the dedicated endpoint
            const skillIds = formData.skills.map(skill => skill.id);
            await updateCandidateSkills(skillIds);

            // Re-fetch and re-populate form with latest data
            const updated = await getCandidateProfile();
            setProfile(updated);
            setFormData({
                first_name: updated.first_name || '',
                last_name: updated.last_name || '',
                phone: updated.phone || '',
                city: updated.city || '',
                university: updated.university || '',
                graduation_year: updated.graduation_year || new Date().getFullYear(),
                degree: updated.degree || '',
                resume: updated.resume || null,
                profile_picture: updated.profile_picture || null,
                skills: updated.skills || [] // Backend returns array of {id, name} objects
            });
            setProfileCompletion(calculateProfileCompletion(updated));
            setIsChanged(false);
            toast.success('Profile updated!');
            updateUser(updated);
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !formData) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#00A55F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading your profile...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00A55F] to-[#008c4f] text-white text-2xl shadow-lg mb-4">
                        <FaUser className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Edit Profile</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Update your information to keep your profile up to date and improve your chances of landing great opportunities.
                    </p>
                </motion.div>

                {/* Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                >
                    {/* Profile Completion Section */}
                    <div className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] px-8 py-6 text-white">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xl font-semibold">Profile Completion</h2>
                            <span className="text-2xl font-bold">{profileCompletion}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                            <motion.div
                                className="bg-white h-3 rounded-full shadow-sm"
                                initial={{ width: 0 }}
                                animate={{ width: `${profileCompletion}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                            />
                        </div>
                        <p className="text-white/90 text-sm">
                            {profileCompletion < 50
                                ? "Complete your profile to increase your visibility to recruiters"
                                : profileCompletion < 80
                                    ? "Great progress! Keep going to maximize your opportunities"
                                    : "Excellent! Your profile is nearly complete"
                            }
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Profile Picture Section */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="flex-shrink-0">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3 text-center sm:text-left">
                                            Profile Picture
                                        </label>
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                                                <img
                                                    src={
                                                        profilePicFile
                                                            ? URL.createObjectURL(profilePicFile)
                                                            : (formData.profile_picture && typeof formData.profile_picture === 'string'
                                                                ? getMediaUrl(formData.profile_picture)
                                                                : stage222Logo)
                                                    }
                                                    alt="Profile"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    onLoad={() => {
                                                        console.log('Edit profile image loaded successfully:', formData.profile_picture);
                                                    }}
                                                    onError={(e) => {
                                                        console.log('Edit profile image failed to load:', {
                                                            profilePicture: formData.profile_picture,
                                                            constructedUrl: getMediaUrl(formData.profile_picture)
                                                        });
                                                        e.target.src = stage222Logo;
                                                    }}
                                                />
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleProfilePicChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                title="Upload new profile picture"
                                            />
                                            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                                <FaCamera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Your Photo</h3>
                                            <p className="text-gray-600 text-sm mb-4">
                                                Upload a professional photo to make your profile stand out.
                                                Recommended: Square image, 400x400 pixels or larger.
                                            </p>
                                        </div>

                                        {profilePicFile && (
                                            <motion.button
                                                type="button"
                                                onClick={handleProfilePictureUpdate}
                                                disabled={isLoadingProfilePicture}
                                                className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {isLoadingProfilePicture ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCamera className="w-5 h-5" />
                                                        Update Profile Picture
                                                    </>
                                                )}
                                            </motion.button>
                                        )}

                                        {errors.profile_picture && (
                                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                                {errors.profile_picture}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information Section */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <FaUser className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className={clsx(
                                                "peer w-full bg-white border-2 border-gray-200 focus:border-[#00A55F] rounded-xl px-4 py-4 text-gray-900 placeholder-transparent focus:outline-none transition-all duration-200 group-hover:border-gray-300",
                                                errors.first_name && "border-red-500 focus:border-red-500"
                                            )}
                                            placeholder="First Name"
                                        />
                                        <label className={clsx(
                                            "absolute left-4 -top-2.5 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#00A55F] bg-white px-2",
                                            errors.first_name && "text-red-500 peer-focus:text-red-500"
                                        )}>
                                            First Name
                                        </label>
                                        {errors.first_name && (
                                            <div className="text-sm text-red-600 mt-2 flex items-center gap-2">
                                                <FaTimes className="w-4 h-4" />
                                                {errors.first_name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className={clsx(
                                                "peer w-full bg-white border-2 border-gray-200 focus:border-[#00A55F] rounded-xl px-4 py-4 text-gray-900 placeholder-transparent focus:outline-none transition-all duration-200 group-hover:border-gray-300",
                                                errors.last_name && "border-red-500 focus:border-red-500"
                                            )}
                                            placeholder="Last Name"
                                        />
                                        <label className={clsx(
                                            "absolute left-4 -top-2.5 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#00A55F] bg-white px-2",
                                            errors.last_name && "text-red-500 peer-focus:text-red-500"
                                        )}>
                                            Last Name
                                        </label>
                                        {errors.last_name && (
                                            <div className="text-sm text-red-600 mt-2 flex items-center gap-2">
                                                <FaTimes className="w-4 h-4" />
                                                {errors.last_name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                        <FaPhone className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                        <div className="flex items-center bg-white border-2 border-gray-200 focus-within:border-[#00A55F] rounded-xl px-4 py-4 transition-all duration-200 group-hover:border-gray-300">
                                            <span className="text-gray-500 font-medium mr-3 select-none">+222</span>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone.replace(/^\+222/, '')}
                                                onChange={e => handleInputChange({ target: { name: 'phone', value: '+222' + e.target.value.replace(/^\+222/, '') } })}
                                                className={clsx(
                                                    "w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-medium",
                                                    errors.phone && "text-red-500"
                                                )}
                                                placeholder="4XXXXXXX"
                                                maxLength={8}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <div className="text-sm text-red-600 mt-2 flex items-center gap-2">
                                                <FaTimes className="w-4 h-4" />
                                                {errors.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={clsx(
                                                "w-full bg-white border-2 border-gray-200 focus:border-[#00A55F] rounded-xl px-4 py-4 text-gray-900 focus:outline-none transition-all duration-200 group-hover:border-gray-300 appearance-none cursor-pointer",
                                                errors.city && "border-red-500 focus:border-red-500"
                                            )}
                                        >
                                            <option value="">Select a city</option>
                                            {mauritanianCities.map(city => (
                                                <option key={city.value} value={city.value}>{city.label}</option>
                                            ))}
                                        </select>
                                        <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        {errors.city && (
                                            <div className="text-sm text-red-600 mt-2 flex items-center gap-2">
                                                <FaTimes className="w-4 h-4" />
                                                {errors.city}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Education Section */}
                            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                                        <FaGraduationCap className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Education</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="university"
                                            value={formData.university}
                                            onChange={handleInputChange}
                                            className={clsx(
                                                "peer w-full bg-white border-2 border-gray-200 focus:border-[#00A55F] rounded-xl px-4 py-4 text-gray-900 placeholder-transparent focus:outline-none transition-all duration-200 group-hover:border-gray-300",
                                                errors.university && "border-red-500 focus:border-red-500"
                                            )}
                                            placeholder="University"
                                        />
                                        <label className={clsx(
                                            "absolute left-4 -top-2.5 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#00A55F] bg-white px-2",
                                            errors.university && "text-red-500 peer-focus:text-red-500"
                                        )}>
                                            University
                                        </label>
                                        {errors.university && (
                                            <div className="text-sm text-red-600 mt-2 flex items-center gap-2">
                                                <FaTimes className="w-4 h-4" />
                                                {errors.university}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative group">
                                        <input
                                            type="number"
                                            name="graduation_year"
                                            value={formData.graduation_year}
                                            onChange={handleInputChange}
                                            className={clsx(
                                                "peer w-full bg-white border-2 border-gray-200 focus:border-[#00A55F] rounded-xl px-4 py-4 text-gray-900 placeholder-transparent focus:outline-none transition-all duration-200 group-hover:border-gray-300",
                                                errors.graduation_year && "border-red-500 focus:border-red-500"
                                            )}
                                            placeholder="Graduation Year"
                                            min={1950}
                                            max={2100}
                                        />
                                        <label className={clsx(
                                            "absolute left-4 -top-2.5 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#00A55F] bg-white px-2",
                                            errors.graduation_year && "text-red-500 peer-focus:text-red-500"
                                        )}>
                                            Graduation Year
                                        </label>
                                        {errors.graduation_year && (
                                            <div className="text-sm text-red-600 mt-2 flex items-center gap-2">
                                                <FaTimes className="w-4 h-4" />
                                                {errors.graduation_year}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="degree"
                                            value={formData.degree}
                                            onChange={handleInputChange}
                                            className={clsx(
                                                "peer w-full bg-white border-2 border-gray-200 focus:border-[#00A55F] rounded-xl px-4 py-4 text-gray-900 placeholder-transparent focus:outline-none transition-all duration-200 group-hover:border-gray-300",
                                                errors.degree && "border-red-500 focus:border-red-500"
                                            )}
                                            placeholder="Degree"
                                        />
                                        <label className={clsx(
                                            "absolute left-4 -top-2.5 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#00A55F] bg-white px-2",
                                            errors.degree && "text-red-500 peer-focus:text-red-500"
                                        )}>
                                            Degree
                                        </label>
                                        {errors.degree && (
                                            <div className="text-sm text-red-600 mt-2 flex items-center gap-2">
                                                <FaTimes className="w-4 h-4" />
                                                {errors.degree}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Resume Section */}
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                                        <FaFileAlt className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Resume</h3>
                                </div>

                                <div className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-300 hover:border-[#00A55F] transition-all duration-200">
                                    <div className="text-center">
                                        <FaFileAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h4>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Upload your CV in PDF, DOC, or DOCX format. This will help recruiters understand your experience better.
                                        </p>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleResumeChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00A55F] file:text-white hover:file:bg-[#008c4f] transition-all duration-200"
                                        />
                                        {formData.resume && (
                                            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                                <div className="flex items-center gap-2 text-green-700">
                                                    <FaCheck className="w-4 h-4" />
                                                    <span className="text-sm font-medium">
                                                        Current: {typeof formData.resume === 'string' ? formData.resume.split('/').pop() : formData.resume.name}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {errors.resume && (
                                            <div className="text-sm text-red-600 mt-2 flex items-center gap-2">
                                                <FaTimes className="w-4 h-4" />
                                                {errors.resume}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                                            <FaStar className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
                                    </div>
                                    <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                                        {allSkills.length > 0 ? `${allSkills.length} skills available` : 'Loading skills...'}
                                    </div>
                                </div>

                                {/* Current Skills Display */}
                                <div className="mb-6">
                                    {formData.skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {formData.skills.map(skill => (
                                                <motion.div
                                                    key={skill.id}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="group relative"
                                                >
                                                    <div className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 hover:shadow-xl transition-all duration-200">
                                                        <span>{skill.name}</span>
                                                        <button
                                                            onClick={() => handleRemoveSkill(skill)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 rounded-full p-1"
                                                            title="Remove skill"
                                                        >
                                                            <FaTimes className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300"
                                        >
                                            <FaStar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 font-medium mb-2 text-lg">No skills added yet</p>
                                            <p className="text-gray-500 text-sm">Search and add your skills to improve your profile visibility</p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Skills Progress */}
                                <div className="mb-6 bg-white rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-gray-700">Skills Progress</span>
                                        <span className="text-sm text-[#00A55F] font-bold">
                                            {formData.skills.length}/10 recommended
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                                        <motion.div
                                            className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] h-3 rounded-full shadow-sm"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((formData.skills.length / 10) * 100, 100)}%` }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        {formData.skills.length < 3
                                            ? `Add ${3 - formData.skills.length} more skill${3 - formData.skills.length !== 1 ? 's' : ''} to complete your profile`
                                            : formData.skills.length < 10
                                                ? `Great! Add ${10 - formData.skills.length} more skill${10 - formData.skills.length !== 1 ? 's' : ''} for better opportunities`
                                                : 'Excellent! You have a comprehensive skill set'
                                        }
                                    </p>
                                </div>

                                {/* Professional Skill Search */}
                                <div className="relative mb-6">
                                    <div className="flex items-center bg-white border-2 border-gray-200 focus-within:border-[#00A55F] rounded-xl px-4 py-4 shadow-sm transition-all duration-200">
                                        <FaSearch className="w-5 h-5 text-gray-400 mr-3" />
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={e => setSkillInput(e.target.value)}
                                            placeholder="Search for skills (e.g., React, Python, Leadership)..."
                                            className="w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 text-base"
                                        />
                                        {skillInput && (
                                            <button
                                                onClick={() => setSkillInput('')}
                                                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                            >
                                                <FaTimes className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Autocomplete Dropdown */}
                                    {filteredSkills.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-20 bg-white border border-gray-200 rounded-xl mt-2 w-full max-h-60 overflow-y-auto shadow-xl"
                                        >
                                            <div className="p-3">
                                                <div className="text-xs text-gray-500 mb-3 px-2 font-medium">Suggestions ({filteredSkills.length})</div>
                                                {filteredSkills.map(skill => (
                                                    <motion.div
                                                        key={skill.id}
                                                        whileHover={{ backgroundColor: '#f0fdf4' }}
                                                        className="px-4 py-3 cursor-pointer rounded-lg hover:bg-green-50 transition-colors flex items-center gap-3 group"
                                                        onClick={() => handleAddSkill(skill)}
                                                    >
                                                        <div className="w-2 h-2 bg-[#00A55F] rounded-full flex-shrink-0"></div>
                                                        <span className="text-gray-700 font-medium">{skill.name}</span>
                                                        <FaPlus className="w-4 h-4 text-[#00A55F] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* No results message */}
                                    {skillInput.trim() !== '' && filteredSkills.length === 0 && allSkills.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute z-20 bg-white border border-gray-200 rounded-xl mt-2 w-full p-6 shadow-xl"
                                        >
                                            <div className="text-center text-gray-500">
                                                <FaSearch className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p className="text-base font-medium">No skills found matching "{skillInput}"</p>
                                                <p className="text-sm mt-1">Try a different search term</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Quick Add Popular Skills */}
                                {allSkills.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-base font-semibold text-gray-700 mb-4">Quick Add Popular Skills</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {allSkills.slice(0, 12).map(skill => (
                                                <motion.button
                                                    key={skill.id}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleAddSkill(skill)}
                                                    disabled={formData.skills.some(s => s.id === skill.id)}
                                                    className={clsx(
                                                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm",
                                                        formData.skills.some(s => s.id === skill.id)
                                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                            : "bg-white text-[#00A55F] border-2 border-[#00A55F] hover:bg-[#00A55F] hover:text-white hover:shadow-md"
                                                    )}
                                                >
                                                    {skill.name}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills Update Button */}
                                <motion.button
                                    type="button"
                                    onClick={handleSkillsUpdate}
                                    disabled={!isChanged || isLoadingSkills}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoadingSkills ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating Skills...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck className="w-5 h-5" />
                                            Update Skills Only
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                className="w-full py-4 px-6 bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white font-bold rounded-xl shadow-xl hover:from-[#008c4f] hover:to-[#00A55F] transition-all duration-200 disabled:opacity-50 text-lg flex items-center justify-center gap-3"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!isChanged}
                            >
                                <FaCheck className="w-6 h-6" />
                                Update Profile
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CandidateEditProfile; 