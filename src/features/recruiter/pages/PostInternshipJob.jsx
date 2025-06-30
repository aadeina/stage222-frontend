import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createInternship } from "@/services/internshipApi";
import { useAuth } from "@/context/AuthContext";

// Accept props for edit mode
const PostInternshipJob = ({ initialFormData = null, onSubmit = null, isEdit = false }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Use initialFormData if provided, otherwise use default
    const [formData, setFormData] = useState(() => initialFormData ? {
        ...{
            opportunityType: "Internship",
            title: "",
            experience: "0",
            skills: [],
            jobType: "Remote",
            workType: "Full-time",
            city: "",
            inOfficeDays: "5",
            timeZone: "",
            workTimings: { start: "", end: "" },
            openings: 1,
            description: "",
            responsibilities: [],
            preferences: [],
            salary: { fixed: { min: "", max: "" }, variable: { min: "", max: "" } },
            perks: [],
            screeningQuestions: [
                "Please confirm your availability for this job. If not available immediately, how early would you be able to join?"
            ],
            additionalQuestions: [],
            alternatePhone: "",
            employeeCount: "",
            startDate: "Immediately",
            duration: "3",
            duration_weeks: 12,
            allowWomenRestart: false,
            stipend: { type: "Paid", fixed: { min: "", max: "" }, incentives: { min: "", max: "" } },
            deadline: "",
            stipend_type: "paid",
            fixed_pay_min: "",
            fixed_pay_max: "",
            incentives_min: "",
            incentives_max: "",
            screening_questions: [],
            eligibility_rules: [],
            other_requirements: ""
        },
        ...initialFormData
    } : {
        opportunityType: "Internship",
        title: "",
        experience: "0",
        skills: [],
        jobType: "Remote",
        workType: "Full-time",
        city: "",
        inOfficeDays: "5",
        timeZone: "",
        workTimings: { start: "", end: "" },
        openings: 1,
        description: "",
        responsibilities: [],
        preferences: [],
        salary: { fixed: { min: "", max: "" }, variable: { min: "", max: "" } },
        perks: [],
        screeningQuestions: [
            "Please confirm your availability for this job. If not available immediately, how early would you be able to join?"
        ],
        additionalQuestions: [],
        alternatePhone: "",
        employeeCount: "",
        startDate: "Immediately",
        duration: "3",
        duration_weeks: 12,
        allowWomenRestart: false,
        stipend: { type: "Paid", fixed: { min: "", max: "" }, incentives: { min: "", max: "" } },
        deadline: "",
        stipend_type: "paid",
        fixed_pay_min: "",
        fixed_pay_max: "",
        incentives_min: "",
        incentives_max: "",
        screening_questions: [],
        eligibility_rules: [],
        other_requirements: ""
    });

    // Form validation
    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = "Title is required";
        }

        if (!formData.description.trim()) {
            errors.description = "Description is required";
        }

        if (formData.opportunityType === "Internship") {
            if (!formData.deadline) {
                errors.deadline = "Application deadline is required";
            }

            if (formData.stipend.type === "Paid") {
                if (!formData.stipend.fixed.min || !formData.stipend.fixed.max) {
                    errors.stipend = "Fixed stipend range is required for paid internships";
                }
            }
        }

        // Fix location validation
        if (formData.jobType === "In office" && !formData.city.trim()) {
            errors.city = "City is required for in-office positions";
        }

        if (formData.jobType === "Remote" && !formData.timeZone) {
            errors.timeZone = "Time zone is required for remote positions";
        }

        // Fix skills validation - check if skills array has valid items
        if (!formData.skills || formData.skills.length === 0 || formData.skills.every(skill => !skill.trim())) {
            errors.skills = "At least one skill is required";
        }

        // Validate Django choice constraints
        const validTypes = ["remote", "hybrid", "in-office"];
        const validJobTypes = ["full-time", "part-time"];
        const validOpportunityTypes = ["job", "internship"];
        const validStipendTypes = ["paid", "unpaid"];
        const validStatuses = ["open", "closed"];
        const validApprovalStatuses = ["pending", "approved", "rejected"];

        // Validate type field
        const currentType = formData.jobType === "In office" ? "in-office" :
            formData.jobType === "Hybrid" ? "hybrid" : "remote";
        if (!validTypes.includes(currentType)) {
            errors.type = `Type must be one of: ${validTypes.join(", ")}`;
        }

        // Validate job_type field
        const currentJobType = formData.workType === "Full-time" ? "full-time" : "part-time";
        if (!validJobTypes.includes(currentJobType)) {
            errors.job_type = `Job type must be one of: ${validJobTypes.join(", ")}`;
        }

        // Validate opportunity_type field
        const currentOpportunityType = formData.opportunityType.toLowerCase();
        if (!validOpportunityTypes.includes(currentOpportunityType)) {
            errors.opportunity_type = `Opportunity type must be one of: ${validOpportunityTypes.join(", ")}`;
        }

        // Validate stipend_type field for internships
        if (formData.opportunityType === "Internship") {
            const currentStipendType = formData.stipend.type.toLowerCase();
            if (!validStipendTypes.includes(currentStipendType)) {
                errors.stipend_type = `Stipend type must be one of: ${validStipendTypes.join(", ")}`;
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Transform form data to API format
    const transformFormDataForAPI = () => {
        // Determine location based on job type
        let location = "Remote"; // default
        if (formData.jobType === "In office" && formData.city.trim()) {
            location = formData.city.trim();
        } else if (formData.jobType === "Hybrid" && formData.city.trim()) {
            location = formData.city.trim();
        }

        const apiData = {
            title: formData.title,
            description: formData.description,
            skills: formData.skills,
            location: location,
            opportunity_type: formData.opportunityType.toLowerCase(),
            job_type: formData.workType === "Full-time" ? "full-time" : "part-time",
            type: formData.jobType === "In office" ? "in-office" :
                formData.jobType === "Hybrid" ? "hybrid" : "remote",
            openings: formData.openings,
            perks: formData.perks,
            screening_questions: [
                "Please confirm your availability for this job. If not available immediately, how early would you be able to join?",
                ...formData.additionalQuestions.map(q => q.text)
            ],
            preferences: formData.preferences,
            other_requirements: formData.other_requirements || "",
            alternate_phone: formData.alternatePhone,
            allow_women_restart: formData.allowWomenRestart,
            status: "open",
            approval_status: "pending"
        };

        // Add internship-specific fields
        if (formData.opportunityType === "Internship") {
            apiData.duration = `${formData.duration} months`;
            apiData.duration_weeks = parseInt(formData.duration) * 4;

            // Fix start_date logic
            if (formData.startDate === "Immediately") {
                apiData.start_date = new Date().toISOString().split('T')[0];
            } else {
                // If "Later", use deadline as start date or add 7 days to today
                apiData.start_date = formData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            }

            apiData.deadline = formData.deadline;
            apiData.stipend_type = formData.stipend.type.toLowerCase();

            if (formData.stipend.type === "Paid") {
                apiData.stipend = formData.stipend.fixed.max || "0";
                apiData.fixed_pay_min = formData.stipend.fixed.min || "0";
                apiData.fixed_pay_max = formData.stipend.fixed.max || "0";
                apiData.incentives_min = formData.stipend.incentives.min || "0";
                apiData.incentives_max = formData.stipend.incentives.max || "0";
            } else {
                apiData.stipend = "0";
                apiData.fixed_pay_min = "0";
                apiData.fixed_pay_max = "0";
                apiData.incentives_min = "0";
                apiData.incentives_max = "0";
            }

            // Add responsibilities field for internships
            apiData.responsibilities = formData.responsibilities.join("\n");
        }

        // Add job-specific fields
        if (formData.opportunityType === "Job") {
            apiData.experience_required = parseInt(formData.experience);
            apiData.salary_fixed_min = formData.salary.fixed.min || "0";
            apiData.salary_fixed_max = formData.salary.fixed.max || "0";
            apiData.salary_variable_min = formData.salary.variable.min || "0";
            apiData.salary_variable_max = formData.salary.variable.max || "0";
        }

        // Add additional fields based on job type
        if (formData.jobType === "Hybrid") {
            apiData.in_office_days = parseInt(formData.inOfficeDays);
        } else if (formData.jobType === "Remote") {
            apiData.timezone = formData.timeZone;
            apiData.work_timings = formData.workTimings;
        }

        // Ensure arrays are properly formatted
        apiData.perks = Array.isArray(apiData.perks) ? apiData.perks : [];
        apiData.preferences = Array.isArray(apiData.preferences) ? apiData.preferences : [];
        apiData.screening_questions = Array.isArray(apiData.screening_questions) ? apiData.screening_questions : [];
        apiData.skills = Array.isArray(apiData.skills) ? apiData.skills : [];

        return apiData;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }

        // Real-time validation for specific fields
        validateField(name, value);
    };

    // Real-time field validation
    const validateField = (fieldName, value) => {
        const newErrors = { ...formErrors };

        switch (fieldName) {
            case 'title':
                if (!value.trim()) {
                    newErrors.title = "Title is required";
                } else {
                    delete newErrors.title;
                }
                break;

            case 'description':
                if (!value.trim()) {
                    newErrors.description = "Description is required";
                } else {
                    delete newErrors.description;
                }
                break;

            case 'deadline':
                if (formData.opportunityType === "Internship" && !value) {
                    newErrors.deadline = "Application deadline is required";
                } else {
                    delete newErrors.deadline;
                }
                break;

            case 'city':
                if (formData.jobType === "In office" && !value.trim()) {
                    newErrors.city = "City is required for in-office positions";
                } else {
                    delete newErrors.city;
                }
                break;

            case 'timeZone':
                if (formData.jobType === "Remote" && !value) {
                    newErrors.timeZone = "Time zone is required for remote positions";
                } else {
                    delete newErrors.timeZone;
                }
                break;

            case 'jobType':
                // Clear city error if switching away from in-office
                if (value !== "In office") {
                    delete newErrors.city;
                }
                // Clear timezone error if switching away from remote
                if (value !== "Remote") {
                    delete newErrors.timeZone;
                }
                break;

            case 'opportunityType':
                // Clear deadline error if switching to job
                if (value === "Job") {
                    delete newErrors.deadline;
                }
                break;
        }

        setFormErrors(newErrors);
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

    const handleStipendChange = (type, field, value) => {
        setFormData(prev => ({
            ...prev,
            stipend: {
                ...prev.stipend,
                [type]: {
                    ...prev.stipend[type],
                    [field]: value
                }
            }
        }));

        // Real-time validation for stipend fields
        if (formData.opportunityType === "Internship" && formData.stipend.type === "Paid") {
            const newErrors = { ...formErrors };

            if (type === "fixed") {
                if (field === "min" && !value) {
                    newErrors.stipend = "Fixed stipend minimum is required for paid internships";
                } else if (field === "max" && !value) {
                    newErrors.stipend = "Fixed stipend maximum is required for paid internships";
                } else {
                    // Check if both min and max are filled
                    const updatedStipend = {
                        ...formData.stipend,
                        [type]: {
                            ...formData.stipend[type],
                            [field]: value
                        }
                    };

                    if (updatedStipend.fixed.min && updatedStipend.fixed.max) {
                        delete newErrors.stipend;
                    }
                }
            }

            setFormErrors(newErrors);
        }
    };

    // Update handleSubmit to use onSubmit if provided
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }
        setIsSubmitting(true);
        try {
            const apiData = transformFormDataForAPI();
            if (onSubmit) {
                await onSubmit(apiData); // Use parent handler for edit
            } else {
                const response = await createInternship(apiData);
                toast.success(`${formData.opportunityType} posted successfully!`);
                navigate('/recruiter/dashboard');
            }
        } catch (err) {
            toast.error('Failed to submit opportunity');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        setIsSavingDraft(true);
        try {
            const apiData = transformFormDataForAPI();
            apiData.status = "draft"; // Add draft status

            console.log("Saving draft with data:", apiData);
            console.log("Draft Payload for Django:", JSON.stringify(apiData, null, 2));

            const response = await createInternship(apiData);
            toast.success("Draft saved successfully!");

            // Optionally redirect or stay on the form
            navigate('/recruiter/dashboard');
        } catch (error) {
            console.error("Save draft error:", error);
            toast.error("Failed to save draft. Please try again.");
        } finally {
            setIsSavingDraft(false);
        }
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
                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.city ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="e.g. Nouakchott"
                            />
                            {formErrors.city && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                            )}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">City/Cities</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.city ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="e.g. Nouakchott"
                            />
                            {formErrors.city && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                            )}
                        </div>
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
                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.timeZone ? 'border-red-500' : 'border-gray-200'}`}
                            >
                                <option value="">Select time zone</option>
                                {Array.from({ length: 13 }, (_, i) => i).map((offset) => (
                                    <option key={offset} value={`UTC+${offset}`}>
                                        UTC+{offset}
                                    </option>
                                ))}
                            </select>
                            {formErrors.timeZone && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.timeZone}</p>
                            )}
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
            {/* Pro Header Section */}
            <section className="pt-12 pb-8 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#00A55F] to-[#34d399] bg-clip-text text-transparent select-none inline-block">
                        Post an Opportunity 🚀
                    </h1>
                    <div className="w-16 h-2 rounded-full bg-gradient-to-r from-[#00A55F] to-[#34d399] mx-auto mb-4"></div>
                    <p className="text-gray-500 text-base md:text-lg font-medium mb-2">Share your job or internship and connect with top Mauritanian talent.</p>
                </div>
            </section>
            {/* Progress Header
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
            </div> */}

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
                    {/* Real-time Validation Status */}
                    {Object.keys(formErrors).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 rounded-lg p-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">!</span>
                                </div>
                                <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                            </div>
                            <ul className="text-sm text-red-700 space-y-1">
                                {Object.entries(formErrors).map(([field, error]) => (
                                    <li key={field} className="flex items-center gap-2">
                                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                        <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                                        <span>{error}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Form Progress Indicator */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">i</span>
                                </div>
                                <span className="text-sm font-medium text-blue-800">Form Status</span>
                            </div>
                            <div className="text-sm text-blue-600">
                                {Object.keys(formErrors).length === 0 ? (
                                    <span className="text-green-600">✓ Ready to submit</span>
                                ) : (
                                    <span>{Object.keys(formErrors).length} error{Object.keys(formErrors).length !== 1 ? 's' : ''} to fix</span>
                                )}
                            </div>
                        </div>
                    </motion.div>

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
                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.title ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                placeholder="e.g. Software Engineer Trainee"
                                            />
                                            {formErrors.title && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                                            )}
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
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-500">
                                                    {formData.skills.length} skill{formData.skills.length !== 1 ? 's' : ''} added
                                                </span>
                                                {formErrors.skills && (
                                                    <span className="text-xs text-red-500">⚠️ {formErrors.skills}</span>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="e.g. Java, React, Node.js"
                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.skills ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        e.preventDefault();
                                                        const newSkill = e.target.value.trim();
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            skills: [...prev.skills, newSkill]
                                                        }));
                                                        e.target.value = '';
                                                        // Clear skills error when user adds a skill
                                                        if (formErrors.skills) {
                                                            setFormErrors(prev => ({ ...prev, skills: "" }));
                                                        }
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    // Also allow adding skills on blur if there's content
                                                    if (e.target.value.trim()) {
                                                        const newSkill = e.target.value.trim();
                                                        if (!formData.skills.includes(newSkill)) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                skills: [...prev.skills, newSkill]
                                                            }));
                                                            if (formErrors.skills) {
                                                                setFormErrors(prev => ({ ...prev, skills: "" }));
                                                            }
                                                        }
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            {formErrors.skills && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.skills}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
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

                                        {/* Conditional fields based on job type */}
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={formData.jobType}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {formData.jobType === "In office" && (
                                                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">City/Cities</label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={formData.city}
                                                                onChange={handleChange}
                                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.city ? 'border-red-500' : 'border-gray-200'}`}
                                                                placeholder="e.g. Nouakchott"
                                                            />
                                                            {formErrors.city && (
                                                                <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {formData.jobType === "Hybrid" && (
                                                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">City/Cities</label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={formData.city}
                                                                onChange={handleChange}
                                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.city ? 'border-red-500' : 'border-gray-200'}`}
                                                                placeholder="e.g. Nouakchott"
                                                            />
                                                            {formErrors.city && (
                                                                <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                                                            )}
                                                        </div>
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
                                                    </div>
                                                )}

                                                {formData.jobType === "Remote" && (
                                                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Zone</label>
                                                            <select
                                                                name="timeZone"
                                                                value={formData.timeZone}
                                                                onChange={handleChange}
                                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.timeZone ? 'border-red-500' : 'border-gray-200'}`}
                                                            >
                                                                <option value="">Select time zone</option>
                                                                {Array.from({ length: 13 }, (_, i) => i).map((offset) => (
                                                                    <option key={offset} value={`UTC+${offset}`}>
                                                                        UTC+{offset}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {formErrors.timeZone && (
                                                                <p className="text-red-500 text-sm mt-1">{formErrors.timeZone}</p>
                                                            )}
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
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

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
                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.description ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                placeholder="Key responsibilities:\n1.\n2.\n3."
                                            />
                                            {formErrors.description && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Candidate Preferences
                                            </label>
                                            <textarea
                                                name="preferences"
                                                value={Array.isArray(formData.preferences) ? formData.preferences.join("\n") : (formData.preferences || "")}
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
                                                            className={`flex-1 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.salary ? 'border-red-500' : 'border-gray-200'
                                                                }`}
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Max"
                                                            value={formData.salary.fixed.max}
                                                            onChange={(e) => handleSalaryChange("fixed", "max", e.target.value)}
                                                            className={`flex-1 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.salary ? 'border-red-500' : 'border-gray-200'
                                                                }`}
                                                        />
                                                        <span className="text-sm text-gray-600">per year</span>
                                                    </div>
                                                    {formErrors.salary && (
                                                        <p className="text-red-500 text-sm mt-1">{formErrors.salary}</p>
                                                    )}
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
                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.title ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                placeholder="e.g. Android App Development"
                                            />
                                            {formErrors.title && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                                            )}
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
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-500">
                                                    {formData.skills.length} skill{formData.skills.length !== 1 ? 's' : ''} added
                                                </span>
                                                {formErrors.skills && (
                                                    <span className="text-xs text-red-500">⚠️ {formErrors.skills}</span>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="e.g. Java, React, Node.js"
                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.skills ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        e.preventDefault();
                                                        const newSkill = e.target.value.trim();
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            skills: [...prev.skills, newSkill]
                                                        }));
                                                        e.target.value = '';
                                                        // Clear skills error when user adds a skill
                                                        if (formErrors.skills) {
                                                            setFormErrors(prev => ({ ...prev, skills: "" }));
                                                        }
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    // Also allow adding skills on blur if there's content
                                                    if (e.target.value.trim()) {
                                                        const newSkill = e.target.value.trim();
                                                        if (!formData.skills.includes(newSkill)) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                skills: [...prev.skills, newSkill]
                                                            }));
                                                            if (formErrors.skills) {
                                                                setFormErrors(prev => ({ ...prev, skills: "" }));
                                                            }
                                                        }
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            {formErrors.skills && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.skills}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Internship Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={6}
                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.description ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                placeholder="Describe the internship opportunity, learning objectives, and what the intern will gain from this experience."
                                            />
                                            {formErrors.description && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
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

                                        {/* Conditional fields based on job type for internships */}
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={formData.jobType}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {formData.jobType === "In office" && (
                                                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">City/Cities</label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={formData.city}
                                                                onChange={handleChange}
                                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.city ? 'border-red-500' : 'border-gray-200'}`}
                                                                placeholder="e.g. Nouakchott"
                                                            />
                                                            {formErrors.city && (
                                                                <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {formData.jobType === "Hybrid" && (
                                                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">City/Cities</label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={formData.city}
                                                                onChange={handleChange}
                                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.city ? 'border-red-500' : 'border-gray-200'}`}
                                                                placeholder="e.g. Nouakchott"
                                                            />
                                                            {formErrors.city && (
                                                                <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                                                            )}
                                                        </div>
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
                                                    </div>
                                                )}

                                                {formData.jobType === "Remote" && (
                                                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Zone</label>
                                                            <select
                                                                name="timeZone"
                                                                value={formData.timeZone}
                                                                onChange={handleChange}
                                                                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.timeZone ? 'border-red-500' : 'border-gray-200'}`}
                                                            >
                                                                <option value="">Select time zone</option>
                                                                {Array.from({ length: 13 }, (_, i) => i).map((offset) => (
                                                                    <option key={offset} value={`UTC+${offset}`}>
                                                                        UTC+{offset}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {formErrors.timeZone && (
                                                                <p className="text-red-500 text-sm mt-1">{formErrors.timeZone}</p>
                                                            )}
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
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                                            <input
                                                type="date"
                                                name="deadline"
                                                value={formData.deadline}
                                                onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            {formErrors.deadline && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.deadline}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Intern's Responsibilities
                                            </label>
                                            <textarea
                                                name="responsibilities"
                                                value={Array.isArray(formData.responsibilities) ? formData.responsibilities.join("\n") : (formData.responsibilities || "")}
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
                                                value={Array.isArray(formData.preferences) ? formData.preferences.join("\n") : (formData.preferences || "")}
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
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    stipend: { ...prev.stipend, type: e.target.value }
                                                                }));

                                                                // Clear stipend error when switching to unpaid
                                                                if (e.target.value === "Unpaid") {
                                                                    setFormErrors(prev => ({ ...prev, stipend: "" }));
                                                                }
                                                            }}
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
                                                            onChange={(e) => handleStipendChange("fixed", "min", e.target.value)}
                                                            className={`flex-1 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.stipend ? 'border-red-500' : 'border-gray-200'
                                                                }`}
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Max"
                                                            value={formData.stipend.fixed.max}
                                                            onChange={(e) => handleStipendChange("fixed", "max", e.target.value)}
                                                            className={`flex-1 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${formErrors.stipend ? 'border-red-500' : 'border-gray-200'
                                                                }`}
                                                        />
                                                        <span className="text-sm text-gray-600">per month</span>
                                                    </div>
                                                    {formErrors.stipend && (
                                                        <p className="text-red-500 text-sm mt-1">{formErrors.stipend}</p>
                                                    )}
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
                                                            onChange={(e) => handleStipendChange("incentives", "min", e.target.value)}
                                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Max"
                                                            value={formData.stipend.incentives.max}
                                                            onChange={(e) => handleStipendChange("incentives", "max", e.target.value)}
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
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">Screening Questions</h2>
                        <p className="text-gray-500 text-sm mb-6">You can use these questions to filter relevant applications</p>
                        <div className="space-y-8">
                            {/* Default Question (always present) */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Availability <span className="text-xs text-gray-400">(Default)</span></div>
                                    <div className="text-sm text-gray-700">Please confirm your availability for this job. If not available immediately, how early would you be able to join?</div>
                                </div>
                            </div>

                            {/* Additional Questions (from bank or custom) */}
                            <div className="space-y-4">
                                {formData.additionalQuestions.map((q, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 relative group transition-all">
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-800 mb-1">{q.text}</div>
                                            {q.idealAnswer && <div className="text-xs text-gray-500">Ideal answer: <span className="font-medium text-gray-700">{q.idealAnswer}</span></div>}
                                            {q.type && <div className="text-xs text-gray-400 mt-1">Response type: {q.type}</div>}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                additionalQuestions: prev.additionalQuestions.filter((_, i) => i !== idx)
                                            }))}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                                            aria-label="Remove question"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Question Bank Chips */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {[
                                    { text: 'Why should you be hired for this role?', idealAnswer: '', type: 'Short Answer' },
                                    { text: 'Do you have a working laptop and internet?', idealAnswer: 'Yes', type: 'Yes/No' },
                                    { text: 'Cover Letter', idealAnswer: '', type: 'Short Answer' },
                                    { text: 'Laptop & Internet', idealAnswer: '', type: 'Yes/No' },
                                    { text: 'Driving License', idealAnswer: '', type: 'Yes/No' },
                                    { text: '2/4 Wheeler', idealAnswer: '', type: 'Yes/No' },
                                    { text: 'Weekend Availability', idealAnswer: '', type: 'Yes/No' },
                                    { text: 'Open for Fieldwork', idealAnswer: '', type: 'Yes/No' },
                                    { text: 'Night Shift', idealAnswer: '', type: 'Yes/No', probable: 'Are you comfortable working night shifts?' },
                                    { text: 'Work Experience', idealAnswer: '', type: 'Short Answer' },
                                    { text: 'Skill Proficiency', idealAnswer: '', type: 'Short Answer' },
                                    { text: 'Portfolio Link', idealAnswer: '', type: 'Short Answer' },
                                    { text: 'Language Proficiency', idealAnswer: '', type: 'Short Answer' },
                                ].map((q, i) => {
                                    // If 'probable', use that as the question text
                                    const questionText = q.probable || q.text;
                                    const alreadyAdded = formData.additionalQuestions.some(added => added.text === questionText);
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            disabled={formData.additionalQuestions.length >= 4 || alreadyAdded}
                                            onClick={() => {
                                                if (!alreadyAdded && formData.additionalQuestions.length < 4) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        additionalQuestions: [
                                                            ...prev.additionalQuestions,
                                                            { text: questionText, idealAnswer: q.idealAnswer, type: q.type }
                                                        ]
                                                    }));
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-lg text-sm border border-gray-200 bg-gray-50 hover:bg-[#00A55F] hover:text-white transition-all ${formData.additionalQuestions.length >= 4 || alreadyAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {q.text}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Add Custom Question Button & Card */}
                            {formData.additionalQuestions.length < 4 && !formData.showCustom && (
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, showCustom: true }))}
                                    className="mt-4 px-4 py-2 border border-[#00A55F] text-[#00A55F] rounded-lg font-medium hover:bg-[#00A55F] hover:text-white transition-all"
                                >
                                    + Add custom question
                                </button>
                            )}
                            {formData.showCustom && formData.additionalQuestions.length < 4 && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-700 mb-1">Custom question {formData.additionalQuestions.length + 1}</div>
                                            <textarea
                                                value={formData.customQuestionText || ''}
                                                onChange={e => setFormData(prev => ({ ...prev, customQuestionText: e.target.value }))}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white"
                                                placeholder="Type in your question"
                                                rows={2}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Response type</label>
                                            <select
                                                value={formData.customQuestionType || 'Short Answer'}
                                                onChange={e => setFormData(prev => ({ ...prev, customQuestionType: e.target.value }))}
                                                className="border border-gray-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white text-sm"
                                            >
                                                <option>Short Answer</option>
                                                <option>Yes/No</option>
                                                <option>Multiple choice</option>
                                                <option>Numbers</option>
                                                <option>Linear Scale (on 1 to 5)</option>
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={!formData.customQuestionText || !formData.customQuestionText.trim()}
                                            onClick={() => {
                                                if (!formData.customQuestionText || !formData.customQuestionText.trim()) return;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    additionalQuestions: [
                                                        ...prev.additionalQuestions,
                                                        {
                                                            text: prev.customQuestionText,
                                                            idealAnswer: '',
                                                            type: prev.customQuestionType || 'Short Answer',
                                                        }
                                                    ],
                                                    customQuestionText: '',
                                                    customQuestionType: 'Short Answer',
                                                    showCustom: false,
                                                }));
                                            }}
                                            className="px-4 py-2 bg-[#00A55F] text-white rounded-lg font-medium hover:bg-[#008c4f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, showCustom: false, customQuestionText: '' }))}
                                            className="px-2 py-2 text-gray-400 hover:text-red-500 transition-colors"
                                            aria-label="Cancel custom question"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    {!formData.customQuestionText && <div className="text-xs text-red-500 mt-2">This field is required</div>}
                                </div>
                            )}
                            {/* Max questions warning */}
                            {formData.additionalQuestions.length >= 4 && (
                                <div className="text-xs text-red-500 mt-2">You've reached the maximum questions limit. Please remove one to add another.</div>
                            )}
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
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    {/* Debug button for development */}
                    <button
                        type="button"
                        onClick={() => {
                            setFormErrors({});
                            console.log("Cleared all validation errors");
                        }}
                        className="px-4 py-2 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                    >
                        Clear Errors (Debug)
                    </button>

                    <div className="flex space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={isSavingDraft || isSubmitting}
                            className="px-6 py-2.5 border-2 border-[#00A55F] text-[#00A55F] rounded-lg font-medium hover:bg-[#00A55F] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSavingDraft ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-[#00A55F] border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </div>
                            ) : (
                                "Save as Draft"
                            )}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting || isSavingDraft}
                            className="px-6 py-2.5 bg-[#00A55F] text-white rounded-lg font-medium hover:bg-[#008f4c] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {isEdit ? 'Updating...' : 'Posting...'}
                                </div>
                            ) : (
                                isEdit ? 'Update Opportunity' : `Post ${formData.opportunityType}`
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PostInternshipJob;
