import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createInternship, updateInternship } from "@/services/internshipApi";

// Clean, internship-only form for create & update
const defaultForm = {
    title: "",
    description: "",
    location: "",
    opportunity_type: "internship",
    job_type: "full-time", // full-time, part-time
    type: "in-office", // remote, hybrid, in-office
    duration: "4 months",
    duration_weeks: 16,
    start_date: "",
    deadline: "",
    stipend_type: "paid",
    stipend: "",
    negotiable: false,
    perks: [],
    responsibilities: "",
    preferences: [],
    screening_questions: [],
    openings: 1,
};

const SUGGESTED_QUESTIONS = [
    "Have you ever organized a community event or workshop?",
    "How would you grow engagement for a student-based platform like Stage222?",
    "Please link to any writing samples, blogs, or public communications you've done",
    "What experience do you have with social media management?",
    "Describe a time you had to communicate with diverse stakeholders"
];

const SUGGESTED_PERKS = [
    "Certificate of Completion",
    "Letter of Recommendation",
    "Networking opportunities with NGOs & startups",
    "Flexible working hours",
    "Free Stage222 merch",
    "Mentorship from industry professionals",
    "Access to exclusive events",
    "Remote work options"
];

const MAURITANIAN_CITIES = [
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

const PostInternshipJob = ({ initialFormData = null, isEdit = false, internshipId = null, onSuccess }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialFormData ? { ...defaultForm, ...initialFormData } : defaultForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [newPerk, setNewPerk] = useState("");
    const [newPreference, setNewPreference] = useState("");
    const [cityQuery, setCityQuery] = useState("");
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Clear stipend when switching to unpaid
        if (name === "stipend_type" && value === "unpaid") {
            setForm((prev) => ({
                ...prev,
                [name]: value,
                stipend: "", // Clear stipend when switching to unpaid
                negotiable: false // Reset negotiable when unpaid
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // Add a screening question
    const addQuestion = (q) => {
        if (!q.trim() || form.screening_questions.length >= 4) return;
        setForm((prev) => ({ ...prev, screening_questions: [...prev.screening_questions, q.trim()] }));
        setNewQuestion("");
    };

    // Remove a screening question
    const removeQuestion = (idx) => {
        setForm((prev) => ({ ...prev, screening_questions: prev.screening_questions.filter((_, i) => i !== idx) }));
    };

    // Add a perk
    const addPerk = (perk) => {
        if (!perk.trim() || form.perks.includes(perk.trim())) return;
        setForm(prev => ({ ...prev, perks: [...prev.perks, perk.trim()] }));
        setNewPerk("");
    };

    // Remove a perk
    const removePerk = (idx) => {
        setForm(prev => ({ ...prev, perks: prev.perks.filter((_, i) => i !== idx) }));
    };

    // Add a preference
    const addPreference = (pref) => {
        if (!pref.trim() || form.preferences.includes(pref.trim())) return;
        setForm(prev => ({ ...prev, preferences: [...prev.preferences, pref.trim()] }));
        setNewPreference("");
    };

    // Remove a preference
    const removePreference = (idx) => {
        setForm(prev => ({ ...prev, preferences: prev.preferences.filter((_, i) => i !== idx) }));
    };

    // Validate required fields
    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.description.trim()) newErrors.description = "Description is required";
        if (!form.location.trim()) newErrors.location = "Location is required";
        if (!form.deadline) newErrors.deadline = "Deadline is required";
        if (!form.stipend_type) newErrors.stipend_type = "Stipend type is required";
        if (form.stipend_type === "paid" && (!form.stipend || form.stipend.trim() === "")) {
            newErrors.stipend = "Stipend amount is required for paid internships";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Prepare API payload
    const getPayload = () => ({
        title: form.title,
        description: form.description,
        location: form.location,
        opportunity_type: form.opportunity_type,
        job_type: form.job_type,
        type: form.type,
        duration: form.duration,
        duration_weeks: Number(form.duration_weeks),
        start_date: form.start_date,
        deadline: form.deadline,
        stipend_type: form.stipend_type,
        stipend: form.stipend_type === "paid" && form.stipend && form.stipend.trim() !== "" ? Number(form.stipend) : null,
        negotiable: form.negotiable,
        perks: form.perks,
        responsibilities: form.responsibilities,
        preferences: form.preferences,
        screening_questions: form.screening_questions,
        openings: Number(form.openings),
        status: "open",
        approval_status: "pending",
    });

    // Filtered cities for autocomplete
    const filteredCities = MAURITANIAN_CITIES.filter(city =>
        city.toLowerCase().includes(cityQuery.toLowerCase())
    );

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const payload = getPayload();
            if (isEdit && internshipId) {
                await updateInternship(internshipId, payload);
                toast.success("Internship updated!");
            } else {
                await createInternship(payload);
                toast.success("Internship posted!");
            }
            if (onSuccess) onSuccess();
            else navigate("/recruiter/dashboard");
        } catch (err) {
            toast.error("Failed to submit internship");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gradient-to-br from-white via-[#f3fdf7] to-[#e6f9f0] p-8 rounded-2xl shadow-xl border border-[#e0f2ea] space-y-8">
            <h2 className="text-3xl font-extrabold text-[#00A55F] mb-2">{isEdit ? "Edit Internship" : "Post Internship"}</h2>
            <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-semibold mb-1 text-gray-800">Title</label>
                        <input name="title" value={form.title} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white" />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>
                    <div className="relative">
                        <label className="block font-semibold mb-1 text-gray-800">Location (Mauritanian city or Remote)</label>
                        <div className="relative">
                            <input
                                name="location"
                                value={form.location}
                                onChange={e => {
                                    handleChange(e);
                                    setCityQuery(e.target.value);
                                    setShowCityDropdown(true);
                                }}
                                onFocus={() => setShowCityDropdown(true)}
                                onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
                                placeholder="Start typing a city..."
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white pr-10"
                                autoComplete="off"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
                            </span>
                            {showCityDropdown && filteredCities.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {filteredCities.map(city => (
                                        <button
                                            key={city}
                                            type="button"
                                            onClick={() => {
                                                setForm(prev => ({ ...prev, location: city }));
                                                setCityQuery(city);
                                                setShowCityDropdown(false);
                                            }}
                                            className={`w-full px-4 py-2 text-left text-sm rounded-md transition-colors ${form.location === city ? 'bg-[#00A55F] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block font-semibold mb-1 text-gray-800">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white" />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Type</label>
                    <div className="relative">
                        <select name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white appearance-none pr-10">
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="in-office">In Office</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Job Type</label>
                    <div className="relative">
                        <select name="job_type" value={form.job_type} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white appearance-none pr-10">
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Openings</label>
                    <input name="openings" type="number" min="1" value={form.openings} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white" />
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Duration (months)</label>
                    <input name="duration" value={form.duration} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white" />
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Duration (weeks)</label>
                    <input name="duration_weeks" type="number" min="1" value={form.duration_weeks} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white" />
                </div>
            </div>
            <div className="border-t border-gray-100 pt-6 mt-6">
                <label className="block font-semibold mb-1 text-gray-800">Responsibilities</label>
                <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white" placeholder="Enter detailed responsibilities..." />
            </div>
            {/* Preferences Section */}
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Preferences</label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {form.preferences.map((pref, i) => (
                        <div key={i} className="flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-1 text-sm text-blue-800 shadow-sm">
                            <span>{pref}</span>
                            <button type="button" onClick={() => removePreference(i)} className="ml-2 text-blue-500 hover:text-red-600 font-bold">×</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newPreference}
                        onChange={e => setNewPreference(e.target.value)}
                        placeholder="Add a preference..."
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent"
                        maxLength={120}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addPreference(newPreference);
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => addPreference(newPreference)}
                        className="bg-[#00A55F] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#008c4f] transition-all"
                        disabled={!newPreference.trim()}
                    >
                        Add
                    </button>
                </div>
            </div>
            {/* Screening Questions Section */}
            <div className="border-t border-gray-100 pt-6 mt-6">
                <div className="flex items-center justify-between mb-2">
                    <label className="block font-semibold text-gray-800 text-lg">Screening Questions</label>
                    <span className="text-xs text-gray-500">Max 4</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                    {form.screening_questions.map((q, i) => (
                        <div key={i} className="flex items-center bg-orange-50 border border-orange-200 rounded-full px-4 py-1 text-sm text-orange-800 shadow-sm">
                            <span>{q}</span>
                            <button type="button" onClick={() => removeQuestion(i)} className="ml-2 text-orange-500 hover:text-red-600 font-bold">×</button>
                        </div>
                    ))}
                </div>
                {form.screening_questions.length < 4 && (
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newQuestion}
                            onChange={e => setNewQuestion(e.target.value)}
                            placeholder="Add a question..."
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent"
                            maxLength={120}
                        />
                        <button
                            type="button"
                            onClick={() => addQuestion(newQuestion)}
                            className="bg-[#00A55F] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#008c4f] transition-all"
                            disabled={!newQuestion.trim()}
                        >
                            Add
                        </button>
                    </div>
                )}
                {form.screening_questions.length < 4 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {SUGGESTED_QUESTIONS.filter(q => !form.screening_questions.includes(q)).map((q, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => addQuestion(q)}
                                className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200 text-xs font-medium"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {/* Perks Section */}
            <div>
                <label className="block font-semibold mb-1 text-gray-800">Perks</label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {form.perks.map((perk, i) => (
                        <div key={i} className="flex items-center bg-green-50 border border-green-200 rounded-full px-4 py-1 text-sm text-green-800 shadow-sm">
                            <span>{perk}</span>
                            <button type="button" onClick={() => removePerk(i)} className="ml-2 text-green-500 hover:text-red-600 font-bold">×</button>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {SUGGESTED_PERKS.filter(perk => !form.perks.includes(perk)).map((perk, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => addPerk(perk)}
                            className="px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 text-xs font-medium"
                        >
                            {perk}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newPerk}
                        onChange={e => setNewPerk(e.target.value)}
                        placeholder="Add a custom perk..."
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent"
                        maxLength={60}
                    />
                    <button
                        type="button"
                        onClick={() => addPerk(newPerk)}
                        className="bg-[#00A55F] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#008c4f] transition-all"
                        disabled={!newPerk.trim()}
                    >
                        Add
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Stipend Type</label>
                    <select name="stipend_type" value={form.stipend_type} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white">
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                    {errors.stipend_type && <p className="text-red-500 text-sm mt-1">{errors.stipend_type}</p>}
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-gray-800">
                        Stipend Amount {form.stipend_type === "unpaid" && <span className="text-gray-500 text-sm">(Not applicable)</span>}
                    </label>
                    <input
                        name="stipend"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.stipend}
                        onChange={handleChange}
                        disabled={form.stipend_type === "unpaid"}
                        className={`w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white ${form.stipend_type === "unpaid" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                            }`}
                    />
                    {errors.stipend && <p className="text-red-500 text-sm mt-1">{errors.stipend}</p>}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="negotiable"
                    checked={form.negotiable}
                    onChange={handleChange}
                    disabled={form.stipend_type === "unpaid"}
                    className={`w-4 h-4 text-[#00A55F] border-gray-300 rounded focus:ring-[#00A55F] ${form.stipend_type === "unpaid" ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                />
                <label className={`text-sm ${form.stipend_type === "unpaid" ? "text-gray-500" : "text-gray-700"}`}>
                    Stipend is negotiable {form.stipend_type === "unpaid" && "(Not applicable)"}
                </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Start Date</label>
                    <div className="relative">
                        <input
                            name="start_date"
                            type="date"
                            value={form.start_date}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white appearance-none pr-10"
                            placeholder="mm/dd/yyyy"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Deadline</label>
                    <div className="relative">
                        <input
                            name="deadline"
                            type="date"
                            value={form.deadline}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent transition-all bg-white appearance-none pr-10"
                            placeholder="mm/dd/yyyy"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>
                        </span>
                    </div>
                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white py-3 rounded-xl font-bold text-lg shadow-md hover:from-[#008c4f] hover:to-[#00A55F] transition-all mt-4">
                {isSubmitting ? (isEdit ? "Updating..." : "Posting...") : (isEdit ? "Update Internship" : "Post Internship")}
            </button>
        </form>
    );
};

export default PostInternshipJob;
