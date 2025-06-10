import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PostInternshipJob = () => {
    const [formData, setFormData] = useState({
        opportunityType: "Job",
        title: "",
        experience: "0",
        skills: [],
        jobType: "Remote",
        workType: "Full-time",
        city: "",
        inOfficeDays: "5",
        timeZone: "",
        workTimings: {
            start: "",
            end: ""
        },
        openings: 1,
        description: "",
        responsibilities: [],
        preferences: [],
        salary: {
            fixed: {
                min: "",
                max: ""
            },
            variable: {
                min: "",
                max: ""
            }
        },
        perks: [],
        screeningQuestions: [
            "Please confirm your availability for this job. If not available immediately, how early would you be able to join?"
        ],
        additionalQuestions: [],
        alternatePhone: "",
        employeeCount: "",
        startDate: "Immediately",
        duration: "3",
        allowWomenRestart: false,
        stipend: {
            type: "Paid",
            fixed: {
                min: "",
                max: ""
            },
            incentives: {
                min: "",
                max: ""
            }
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleArrayInput = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value.split("\n").filter(item => item.trim()),
        }));
    };

    const handleSalaryChange = (type, field, value) => {
        setFormData(prev => ({
            ...prev,
            salary: {
                ...prev.salary,
                [type]: {
                    ...prev.salary[type],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted data:", formData);
    };

    const renderJobTypeFields = () => {
        switch (formData.jobType) {
            case "In office":
                return (
                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City/Cities</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                placeholder="e.g. Nouakchott"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Part-time/Full-time</label>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {["Part-time", "Full-time"].map((type) => (
                                    <label
                                        key={type}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="workType"
                                            value={type}
                                            checked={formData.workType === type}
                                            onChange={handleChange}
                                            className="form-radio h-4 w-4 text-[#00A55F] transition-all focus:ring-[#00A55F]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case "Hybrid":
                return (
                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">No. of in-office days in a week</label>
                            <select
                                name="inOfficeDays"
                                value={formData.inOfficeDays}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                            >
                                {[1, 2, 3, 4, 5].map((days) => (
                                    <option key={days} value={days}>
                                        {days} {days === 1 ? "day" : "days"}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Part-time/Full-time</label>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {["Part-time", "Full-time"].map((type) => (
                                    <label
                                        key={type}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="workType"
                                            value={type}
                                            checked={formData.workType === type}
                                            onChange={handleChange}
                                            className="form-radio h-4 w-4 text-[#00A55F] transition-all focus:ring-[#00A55F]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case "Remote":
                return (
                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Part-time/Full-time</label>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {["Part-time", "Full-time"].map((type) => (
                                    <label
                                        key={type}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="workType"
                                            value={type}
                                            checked={formData.workType === type}
                                            onChange={handleChange}
                                            className="form-radio h-4 w-4 text-[#00A55F] transition-all focus:ring-[#00A55F]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Zone</label>
                            <select
                                name="timeZone"
                                value={formData.timeZone}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                            >
                                <option value="">Select time zone</option>
                                {Array.from({ length: 13 }, (_, i) => i).map((offset) => (
                                    <option key={offset} value={`UTC+${offset}`}>
                                        UTC+{offset}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Work Timings</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">From</label>
                                    <input
                                        type="time"
                                        value={formData.workTimings.start}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            workTimings: { ...prev.workTimings, start: e.target.value }
                                        }))}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">To</label>
                                    <input
                                        type="time"
                                        value={formData.workTimings.end}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            workTimings: { ...prev.workTimings, end: e.target.value }
                                        }))}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Progress Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#00A55F] text-white flex items-center justify-center font-medium">1</div>
                                <span className="ml-2 text-sm font-medium text-gray-600">Personal Details</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#00A55F] text-white flex items-center justify-center font-medium">2</div>
                                <span className="ml-2 text-sm font-medium text-gray-600">Organization Details</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#00A55F] text-white flex items-center justify-center font-medium">3</div>
                                <span className="ml-2 text-sm font-medium text-gray-900">Post Job/Internship</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-800">Post Job/Internship</h1>
                    <p className="text-gray-600 mt-2">Hire early talent with work experience up to 2 years</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Opportunity Type Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Opportunity Type</h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {["Job", "Internship"].map((type) => (
                                <label
                                    key={type}
                                    className="flex items-center cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="opportunityType"
                                        value={type}
                                        checked={formData.opportunityType === type}
                                        onChange={handleChange}
                                        className="form-radio h-4 w-4 text-[#00A55F] transition-all focus:ring-[#00A55F]"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                                </label>
                            ))}
                        </div>
                    </motion.section>

                    <AnimatePresence mode="wait">
                        {formData.opportunityType === "Job" ? (
                            <motion.div
                                key="job"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Job Details Section */}
                                <motion.section className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Job Details</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                placeholder="e.g. Software Engineer Trainee"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Experience Required</label>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                {["0", "1"].map((years) => (
                                                    <label
                                                        key={years}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="experience"
                                                            value={years}
                                                            checked={formData.experience === years}
                                                            onChange={handleChange}
                                                            className="form-radio h-4 w-4 text-[#00A55F] transition-all focus:ring-[#00A55F]"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">{years} {years === "1" ? "year" : "years"}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Skills Required</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                                                    >
                                                        {skill}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    skills: prev.skills.filter((_, i) => i !== index)
                                                                }));
                                                            }}
                                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="e.g. Java, React, Node.js"
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        e.preventDefault();
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            skills: [...prev.skills, e.target.value.trim()]
                                                        }));
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
                                                {["In office", "Hybrid", "Remote"].map((type) => (
                                                    <label
                                                        key={type}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="jobType"
                                                            value={type}
                                                            checked={formData.jobType === type}
                                                            onChange={handleChange}
                                                            className="form-radio h-4 w-4 text-[#00A55F] transition-all focus:ring-[#00A55F]"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={formData.jobType}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {renderJobTypeFields()}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Openings</label>
                                            <input
                                                type="number"
                                                name="openings"
                                                value={formData.openings}
                                                onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                min={1}
                                                placeholder="e.g. 4"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={6}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                placeholder="Key responsibilities:\n1.\n2.\n3."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Candidate Preferences
                                            </label>
                                            <textarea
                                                name="preferences"
                                                value={formData.preferences.join("\n")}
                                                onChange={(e) => handleArrayInput("preferences", e.target.value)}
                                                rows={4}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                placeholder="1.\n2.\n3."
                                            />
                                        </div>
                                    </div>
                                </motion.section>

                                {/* Salary & Perks Section */}
                                <motion.section className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Salary & Perks</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-4">CTC Breakup</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Pay</label>
                                                    <p className="text-sm text-gray-600 mb-2">Fixed pay is the fixed component of the CTC</p>
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="number"
                                                            placeholder="Min"
                                                            value={formData.salary.fixed.min}
                                                            onChange={(e) => handleSalaryChange("fixed", "min", e.target.value)}
                                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Max"
                                                            value={formData.salary.fixed.max}
                                                            onChange={(e) => handleSalaryChange("fixed", "max", e.target.value)}
                                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                        />
                                                        <span className="text-sm text-gray-600">per year</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Variables/Incentives</label>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        If the role includes incentives/variable pay, we recommend mentioning it to attract better talent.
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="number"
                                                            placeholder="Min"
                                                            value={formData.salary.variable.min}
                                                            onChange={(e) => handleSalaryChange("variable", "min", e.target.value)}
                                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Max"
                                                            value={formData.salary.variable.max}
                                                            onChange={(e) => handleSalaryChange("variable", "max", e.target.value)}
                                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                        />
                                                        <span className="text-sm text-gray-600">per year</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Perks</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {[
                                                    "5 days a week",
                                                    "Health Insurance",
                                                    "Life Insurance",
                                                    "Flexible work hours",
                                                    "Informal dress code",
                                                    "Free snacks & beverages"
                                                ].map((perk) => (
                                                    <label key={perk} className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.perks.includes(perk)}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    perks: e.target.checked
                                                                        ? [...prev.perks, perk]
                                                                        : prev.perks.filter(p => p !== perk)
                                                                }));
                                                            }}
                                                            className="form-checkbox rounded border-gray-300 text-[#00A55F] focus:ring-[#00A55F]"
                                                        />
                                                        <span className="text-sm text-gray-700">{perk}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.section>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="internship"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Internship Details Section */}
                                <motion.section className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Internship Details</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Internship Profile</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                placeholder="e.g. Android App Development"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Skills Required</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                                                    >
                                                        {skill}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    skills: prev.skills.filter((_, i) => i !== index)
                                                                }));
                                                            }}
                                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="e.g. Java, React, Node.js"
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        e.preventDefault();
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            skills: [...prev.skills, e.target.value.trim()]
                                                        }));
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Internship Type</label>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                    {["In office", "Hybrid", "Remote"].map((type) => (
                                                        <label
                                                            key={type}
                                                            className="flex items-center cursor-pointer"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="jobType"
                                                                value={type}
                                                                checked={formData.jobType === type}
                                                                onChange={handleChange}
                                                                className="form-radio h-4 w-4 text-[#00A55F] transition-all focus:ring-[#00A55F]"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Part-time/Full-time</label>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                    {["Part-time", "Full-time"].map((type) => (
                                                        <label
                                                            key={type}
                                                            className="flex items-center cursor-pointer"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="workType"
                                                                value={type}
                                                                checked={formData.workType === type}
                                                                onChange={handleChange}
                                                                className="form-radio h-4 w-4 text-[#00A55F] transition-all focus:ring-[#00A55F]"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Openings</label>
                                                <input
                                                    type="number"
                                                    name="openings"
                                                    value={formData.openings}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                    min={1}
                                                    placeholder="e.g. 4"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                    {["Immediately", "Later"].map((type) => (
                                                        <label
                                                            key={type}
                                                            className="flex items-center cursor-pointer"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="startDate"
                                                                value={type}
                                                                checked={formData.startDate === type}
                                                                onChange={handleChange}
                                                                className="form-radio h-4 w-4 text-[#00A55F] transition-all focus:ring-[#00A55F]"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                            <select
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                            >
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                                    <option key={month} value={month}>
                                                        {month} {month === 1 ? "Month" : "Months"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Intern's Responsibilities
                                            </label>
                                            <textarea
                                                name="responsibilities"
                                                value={formData.responsibilities.join("\n")}
                                                onChange={(e) => handleArrayInput("responsibilities", e.target.value)}
                                                rows={4}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                placeholder="1.\n2.\n3."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Candidate Preferences
                                            </label>
                                            <textarea
                                                name="preferences"
                                                value={formData.preferences.join("\n")}
                                                onChange={(e) => handleArrayInput("preferences", e.target.value)}
                                                rows={4}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                placeholder="1.\n2.\n3."
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.allowWomenRestart}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, allowWomenRestart: e.target.checked }))}
                                                    className="form-checkbox rounded border-gray-300 text-[#00A55F] focus:ring-[#00A55F]"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    Allow applications from women also who are willing to start/restart their career
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </motion.section>

                                {/* Stipend & Perks Section */}
                                <motion.section className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Stipend & Perks</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Stipend Type</label>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                {["Paid", "Unpaid"].map((type) => (
                                                    <label
                                                        key={type}
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="stipendType"
                                                            value={type}
                                                            checked={formData.stipend.type === type}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, stipend: { ...prev.stipend, type: e.target.value } }))}
                                                            className="form-radio h-4 w-4 text-[#00A55F] transition-all focus:ring-[#00A55F]"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {formData.stipend.type === "Paid" && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Stipend</label>
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="number"
                                                            placeholder="Min"
                                                            value={formData.stipend.fixed.min}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                stipend: {
                                                                    ...prev.stipend,
                                                                    fixed: { ...prev.stipend.fixed, min: e.target.value }
                                                                }
                                                            }))}
                                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Max"
                                                            value={formData.stipend.fixed.max}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                stipend: {
                                                                    ...prev.stipend,
                                                                    fixed: { ...prev.stipend.fixed, max: e.target.value }
                                                                }
                                                            }))}
                                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                        />
                                                        <span className="text-sm text-gray-600">per month</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Incentives</label>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        If the role includes incentives/variable pay, we recommend mentioning it to attract better talent.
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="number"
                                                            placeholder="Min"
                                                            value={formData.stipend.incentives.min}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                stipend: {
                                                                    ...prev.stipend,
                                                                    incentives: { ...prev.stipend.incentives, min: e.target.value }
                                                                }
                                                            }))}
                                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Max"
                                                            value={formData.stipend.incentives.max}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                stipend: {
                                                                    ...prev.stipend,
                                                                    incentives: { ...prev.stipend.incentives, max: e.target.value }
                                                                }
                                                            }))}
                                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                        />
                                                        <span className="text-sm text-gray-600">per month</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Perks</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {[
                                                    "Certificate",
                                                    "Letter of recommendation",
                                                    "Flexible work hours",
                                                    "5 days a week",
                                                    "Informal dress code",
                                                    "Free snacks & beverages"
                                                ].map((perk) => (
                                                    <label key={perk} className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.perks.includes(perk)}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    perks: e.target.checked
                                                                        ? [...prev.perks, perk]
                                                                        : prev.perks.filter(p => p !== perk)
                                                                }));
                                                            }}
                                                            className="form-checkbox rounded border-gray-300 text-[#00A55F] focus:ring-[#00A55F]"
                                                        />
                                                        <span className="text-sm text-gray-700">{perk}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.section>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Screening Questions Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Screening Questions</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Default Questions</label>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        Please confirm your availability for this job. If not available immediately, how early would you be able to join?
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Questions</label>
                                <p className="text-sm text-gray-600 mb-4">
                                    Please note this may result in a decrease in the number of applications.
                                </p>
                                <div className="space-y-4">
                                    {formData.additionalQuestions.map((question, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <input
                                                type="text"
                                                value={question}
                                                onChange={(e) => {
                                                    const newQuestions = [...formData.additionalQuestions];
                                                    newQuestions[index] = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        additionalQuestions: newQuestions
                                                    }));
                                                }}
                                                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                placeholder="Enter your question"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        additionalQuestions: prev.additionalQuestions.filter((_, i) => i !== index)
                                                    }));
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    {formData.additionalQuestions.length < 4 && (
                                        <div className="space-y-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        additionalQuestions: [...prev.additionalQuestions, ""]
                                                    }));
                                                }}
                                                className="text-[#00A55F] hover:text-[#008f4c] font-medium"
                                            >
                                                + Add Question
                                            </button>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                                {[
                                                    "Cover Letter",
                                                    "Laptop & Internet",
                                                    "Driving License",
                                                    "2/4 Wheeler",
                                                    "Weekend Availability",
                                                    "Open for Fieldwork",
                                                    "Night Shift",
                                                    "Work Experience",
                                                    "Skill Proficiency",
                                                    "Portfolio Link",
                                                    "Language Proficiency"
                                                ].map((question) => (
                                                    <button
                                                        key={question}
                                                        type="button"
                                                        onClick={() => {
                                                            if (formData.additionalQuestions.length < 4) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    additionalQuestions: [...prev.additionalQuestions, question]
                                                                }));
                                                            }
                                                        }}
                                                        className="text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                                                    >
                                                        {question}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Additional Listing Info Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Additional Listing Info</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alternate mobile number for this listing
                                </label>
                                <p className="text-sm text-gray-600 mb-4">
                                    Our team will call you on this number in case of any query regarding this listing only.
                                </p>
                                <div className="flex space-x-4">
                                    <div className="w-20">
                                        <input
                                            type="text"
                                            value="+222"
                                            disabled
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="tel"
                                            name="alternatePhone"
                                            value={formData.alternatePhone}
                                            onChange={handleChange}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    No. of employees in your Organization
                                </label>
                                <select
                                    name="employeeCount"
                                    value={formData.employeeCount}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                >
                                    <option value="">Select number of employees</option>
                                    <option value="0-1">0-1</option>
                                    <option value="2-10">2-10</option>
                                    <option value="11-50">11-50</option>
                                    <option value="51-100">51-100</option>
                                    <option value="101-500">101-500</option>
                                    <option value="501+">501+</option>
                                </select>
                            </div>
                        </div>
                    </motion.section>
                </form>
            </div>

            {/* Sticky Bottom Action Bar */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4"
            >
                <div className="max-w-5xl mx-auto flex justify-end space-x-4">
                    <button
                        type="button"
                        className="px-6 py-2.5 border-2 border-[#00A55F] text-[#00A55F] rounded-lg font-medium hover:bg-[#00A55F] hover:text-white transition-all"
                    >
                        Save as Draft
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-[#00A55F] text-white rounded-lg font-medium hover:bg-[#008f4c] transition-all shadow-sm"
                    >
                        Post {formData.opportunityType}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default PostInternshipJob;
