import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getCandidateProfile, updateCandidateProfile, updateCandidateResume, updateCandidateSkills, getAllSkills, deleteCandidateSkill } from '../api/candidateApi';
import SkillBadge from '@/components/ui/SkillBadge';
import { FaUser, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaUniversity, FaCalendarAlt, FaFileAlt, FaCamera, FaCheck, FaPlus, FaTimes, FaStar, FaSearch } from 'react-icons/fa';
import stage222Logo from '@/assets/images/MainStage222Logo.png';
import clsx from 'clsx';
import { useAuth } from '../../../context/AuthContext';



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

    if (isLoading || !formData) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-0 sm:p-6 bg-gradient-to-br from-white via-blue-50 to-green-50 rounded-2xl shadow-2xl mt-8 border border-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 sm:p-10"
            >
                <div className="flex items-center gap-4 mb-6">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#00A55F] to-[#008c4f] text-white text-2xl shadow">
                        🗂️
                    </span>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900">Edit Profile</h2>
                        <p className="text-gray-500 text-sm">Update your information to keep your profile up to date.</p>
                    </div>
                </div>
                {/* Profile completion bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                        <span className="text-sm font-semibold text-[#00A55F]">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-[#00A55F] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${profileCompletion}%` }}
                        ></div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Profile Picture upload */}
                        <div className="col-span-1 flex flex-col items-center gap-2">
                            <label className="block text-sm font-medium mb-1">Profile Picture</label>
                            <div className="relative group">
                                <img
                                    src={profilePicFile ? URL.createObjectURL(profilePicFile) : (typeof formData.profile_picture === 'string' && formData.profile_picture ? formData.profile_picture : stage222Logo)}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-80 transition"
                                />
                                <input type="file" accept="image/*" onChange={handleProfilePicChange} className="absolute inset-0 opacity-0 cursor-pointer" title="Upload new profile picture" />
                                <span className="absolute bottom-0 right-0 bg-[#00A55F] text-white rounded-full p-1 shadow -mb-2 -mr-2 text-xs group-hover:scale-110 transition">Edit</span>
                            </div>
                            {errors.profile_picture && <div className="text-xs text-red-600 mt-1">{errors.profile_picture}</div>}
                        </div>
                        <div className="col-span-1 grid grid-cols-1 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className={clsx("peer w-full border-b-2 border-gray-200 focus:border-[#00A55F] bg-transparent px-0 py-2 text-gray-900 placeholder-transparent focus:outline-none transition", errors.first_name && "border-red-500")}
                                    placeholder="First Name"
                                />
                                <label className="absolute left-0 -top-3.5 text-gray-600 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-600">First Name</label>
                                {errors.first_name && <div className="text-xs text-red-600 mt-1">{errors.first_name}</div>}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className={clsx("peer w-full border-b-2 border-gray-200 focus:border-[#00A55F] bg-transparent px-0 py-2 text-gray-900 placeholder-transparent focus:outline-none transition", errors.last_name && "border-red-500")}
                                    placeholder="Last Name"
                                />
                                <label className="absolute left-0 -top-3.5 text-gray-600 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-600">Last Name</label>
                                {errors.last_name && <div className="text-xs text-red-600 mt-1">{errors.last_name}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#00A55F] bg-transparent px-0 py-2">
                                <span className="text-gray-500 mr-2 select-none">+222</span>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone.replace(/^\+222/, '')}
                                    onChange={e => handleInputChange({ target: { name: 'phone', value: '+222' + e.target.value.replace(/^\+222/, '') } })}
                                    className={clsx("w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400", errors.phone && "border-red-500")}
                                    placeholder="4XXXXXXX"
                                    maxLength={8}
                                />
                            </div>
                            {errors.phone && <div className="text-xs text-red-600 mt-1">{errors.phone}</div>}
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1">City</label>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className={clsx("w-full border-b-2 border-gray-200 focus:border-[#00A55F] bg-transparent px-0 py-2 text-gray-900 focus:outline-none transition", errors.city && "border-red-500")}
                            >
                                <option value="">Select a city</option>
                                {mauritanianCities.map(city => (
                                    <option key={city.value} value={city.value}>{city.label}</option>
                                ))}
                            </select>
                            {errors.city && <div className="text-xs text-red-600 mt-1">{errors.city}</div>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="relative">
                            <input
                                type="text"
                                name="university"
                                value={formData.university}
                                onChange={handleInputChange}
                                className={clsx("peer w-full border-b-2 border-gray-200 focus:border-[#00A55F] bg-transparent px-0 py-2 text-gray-900 placeholder-transparent focus:outline-none transition", errors.university && "border-red-500")}
                                placeholder="University"
                            />
                            <label className="absolute left-0 -top-3.5 text-gray-600 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-600">University</label>
                            {errors.university && <div className="text-xs text-red-600 mt-1">{errors.university}</div>}
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                name="graduation_year"
                                value={formData.graduation_year}
                                onChange={handleInputChange}
                                className={clsx("peer w-full border-b-2 border-gray-200 focus:border-[#00A55F] bg-transparent px-0 py-2 text-gray-900 placeholder-transparent focus:outline-none transition", errors.graduation_year && "border-red-500")}
                                placeholder="Graduation Year"
                                min={1950}
                                max={2100}
                            />
                            <label className="absolute left-0 -top-3.5 text-gray-600 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-600">Graduation Year</label>
                            {errors.graduation_year && <div className="text-xs text-red-600 mt-1">{errors.graduation_year}</div>}
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            name="degree"
                            value={formData.degree}
                            onChange={handleInputChange}
                            className={clsx("peer w-full border-b-2 border-gray-200 focus:border-[#00A55F] bg-transparent px-0 py-2 text-gray-900 placeholder-transparent focus:outline-none transition", errors.degree && "border-red-500")}
                            placeholder="Degree"
                        />
                        <label className="absolute left-0 -top-3.5 text-gray-600 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-gray-600">Degree</label>
                        {errors.degree && <div className="text-xs text-red-600 mt-1">{errors.degree}</div>}
                    </div>
                    {/* Resume upload */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Resume</label>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="block" />
                        {formData.resume && (
                            <div className="mt-2 text-xs text-gray-600">Current: {typeof formData.resume === 'string' ? formData.resume.split('/').pop() : formData.resume.name}</div>
                        )}
                        {errors.resume && <div className="text-xs text-red-600 mt-1">{errors.resume}</div>}
                    </div>
                    {/* Skills with dynamic autocomplete */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium">Skills</label>
                            <div className="text-xs text-gray-500">
                                {allSkills.length > 0 ? `${allSkills.length} skills available` : 'Loading skills...'}
                            </div>
                        </div>

                        {/* Current Skills Display */}
                        <div className="mb-6">
                            {formData.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.skills.map(skill => (
                                        <motion.div
                                            key={skill.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            whileHover={{ scale: 1.05 }}
                                            className="group relative"
                                        >
                                            <div className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white px-3 py-2 rounded-full text-sm font-medium shadow-md flex items-center gap-2">
                                                <span>{skill.name}</span>
                                                <button
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 rounded-full p-0.5"
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
                                    className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300"
                                >
                                    <FaStar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium mb-1">No skills added yet</p>
                                    <p className="text-gray-500 text-sm">Search and add your skills to improve your profile</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Skills Progress */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Skills Progress</span>
                                <span className="text-sm text-[#00A55F] font-semibold">
                                    {formData.skills.length}/10 recommended
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                    className="bg-gradient-to-r from-[#00A55F] to-[#008c4f] h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((formData.skills.length / 10) * 100, 100)}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.skills.length < 3
                                    ? `Add ${3 - formData.skills.length} more skill${3 - formData.skills.length !== 1 ? 's' : ''} to complete your profile`
                                    : formData.skills.length < 10
                                        ? `Great! Add ${10 - formData.skills.length} more skill${10 - formData.skills.length !== 1 ? 's' : ''} for better opportunities`
                                        : 'Excellent! You have a comprehensive skill set'
                                }
                            </p>
                        </div>

                        {/* Professional Skill Search */}
                        <div className="relative">
                            <div className="flex items-center border-2 border-gray-200 focus-within:border-[#00A55F] bg-white rounded-xl px-4 py-3 shadow-sm transition-all duration-200">
                                <FaSearch className="w-4 h-4 text-gray-400 mr-3" />
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    placeholder="Search for skills (e.g., React, Python, Leadership)..."
                                    className="w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                                />
                                {skillInput && (
                                    <button
                                        onClick={() => setSkillInput('')}
                                        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <FaTimes className="w-4 h-4" />
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
                                    <div className="p-2">
                                        <div className="text-xs text-gray-500 mb-2 px-2">Suggestions ({filteredSkills.length})</div>
                                        {filteredSkills.map(skill => (
                                            <motion.div
                                                key={skill.id}
                                                whileHover={{ backgroundColor: '#f0fdf4' }}
                                                className="px-3 py-2.5 cursor-pointer rounded-lg hover:bg-green-50 transition-colors flex items-center gap-3"
                                                onClick={() => handleAddSkill(skill)}
                                            >
                                                <div className="w-2 h-2 bg-[#00A55F] rounded-full flex-shrink-0"></div>
                                                <span className="text-gray-700 font-medium">{skill.name}</span>
                                                <FaPlus className="w-3 h-3 text-[#00A55F] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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
                                    className="absolute z-20 bg-white border border-gray-200 rounded-xl mt-2 w-full p-4 shadow-xl"
                                >
                                    <div className="text-center text-gray-500">
                                        <FaSearch className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">No skills found matching "{skillInput}"</p>
                                        <p className="text-xs mt-1">Try a different search term</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Quick Add Popular Skills */}
                        {allSkills.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Add Popular Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {allSkills.slice(0, 12).map(skill => (
                                        <motion.button
                                            key={skill.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAddSkill(skill)}
                                            disabled={formData.skills.some(s => s.id === skill.id)}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                                                formData.skills.some(s => s.id === skill.id)
                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    : "bg-white text-[#00A55F] border border-[#00A55F] hover:bg-[#00A55F] hover:text-white shadow-sm"
                                            )}
                                        >
                                            {skill.name}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            type="button"
                            onClick={handleSkillsUpdate}
                            disabled={!isChanged || isLoadingSkills}
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoadingSkills ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                'Update Skills Only'
                            )}
                        </motion.button>
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white font-semibold rounded-xl shadow hover:from-[#008c4f] hover:to-[#00A55F] transition disabled:opacity-50 text-lg mt-4"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!isChanged}
                    >
                        Update Profile
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default CandidateEditProfile; 