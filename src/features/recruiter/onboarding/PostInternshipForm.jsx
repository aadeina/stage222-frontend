import PropTypes from 'prop-types';

const PostInternshipForm = ({
    formData,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    internshipTypes,
    durationOptions,
    workModeOptions,
    skillLevels
}) => {
    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Internship Title
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Frontend Development Intern"
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Describe the internship role, responsibilities, and requirements..."
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Internship Type
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select type</option>
                        {internshipTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.type && (
                        <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                    </label>
                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select duration</option>
                        {durationOptions.map((duration) => (
                            <option key={duration} value={duration}>
                                {duration}
                            </option>
                        ))}
                    </select>
                    {errors.duration && (
                        <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Mode
                    </label>
                    <select
                        name="workMode"
                        value={formData.workMode}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.workMode ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select work mode</option>
                        {workModeOptions.map((mode) => (
                            <option key={mode} value={mode}>
                                {mode}
                            </option>
                        ))}
                    </select>
                    {errors.workMode && (
                        <p className="mt-1 text-sm text-red-500">{errors.workMode}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skill Level
                    </label>
                    <select
                        name="skillLevel"
                        value={formData.skillLevel}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.skillLevel ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select skill level</option>
                        {skillLevels.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                    {errors.skillLevel && (
                        <p className="mt-1 text-sm text-red-500">{errors.skillLevel}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Skills
                </label>
                <textarea
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="List the required skills (one per line)"
                />
                {errors.requiredSkills && (
                    <p className="mt-1 text-sm text-red-500">{errors.requiredSkills}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefits
                </label>
                <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.benefits ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="List the benefits of this internship (one per line)"
                />
                {errors.benefits && (
                    <p className="mt-1 text-sm text-red-500">{errors.benefits}</p>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#00A55F] text-white rounded-lg hover:bg-[#008c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Posting...
                        </div>
                    ) : (
                        'Post Internship'
                    )}
                </button>
            </div>
        </div>
    );
};

PostInternshipForm.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    internshipTypes: PropTypes.array.isRequired,
    durationOptions: PropTypes.array.isRequired,
    workModeOptions: PropTypes.array.isRequired,
    skillLevels: PropTypes.array.isRequired
};

export default PostInternshipForm; 