import PropTypes from 'prop-types';

const OrganizationForm = ({
    formData,
    errors,
    handleChange,
    handleLogoChange,
    handleVerificationMethodChange,
    handleSocialLinkChange,
    handleAddSocialLink,
    handleRemoveSocialLink,
    industries,
    cities,
    employeeRanges,
    socialLinks,
    logoPreview,
    verificationMethods,
    isSubmitting
}) => {
    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name
                </label>
                <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.organizationName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.organizationName && (
                    <p className="mt-1 text-sm text-red-500">{errors.organizationName}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Logo
                </label>
                <div className="mt-1 flex items-center">
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                            id="logo-upload"
                        />
                        <label
                            htmlFor="logo-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A55F]"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Upload Logo
                        </label>
                    </div>
                    {logoPreview && (
                        <div className="ml-4">
                            <img
                                src={logoPreview}
                                alt="Organization logo preview"
                                className="h-12 w-12 rounded-full object-cover"
                            />
                        </div>
                    )}
                </div>
                {errors.logo && (
                    <p className="mt-1 text-sm text-red-500">{errors.logo}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    About Organization
                </label>
                <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.about ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Tell us about your organization..."
                />
                {errors.about && (
                    <p className="mt-1 text-sm text-red-500">{errors.about}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                    </label>
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select a city</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                    {errors.city && (
                        <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                    </label>
                    <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select an industry</option>
                        {industries.map((industry) => (
                            <option key={industry} value={industry}>
                                {industry}
                            </option>
                        ))}
                    </select>
                    {errors.industry && (
                        <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Employees
                </label>
                <select
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.employeeCount ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <option value="">Select range</option>
                    {employeeRanges.map((range) => (
                        <option key={range} value={range}>
                            {range}
                        </option>
                    ))}
                </select>
                {errors.employeeCount && (
                    <p className="mt-1 text-sm text-red-500">{errors.employeeCount}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Verification
                </label>
                <div className="space-y-3">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="license"
                            checked={verificationMethods.license}
                            onChange={() => handleVerificationMethodChange('license')}
                            className="h-4 w-4 text-[#00A55F] focus:ring-[#00A55F] border-gray-300 rounded"
                        />
                        <label htmlFor="license" className="ml-2 block text-sm text-gray-700">
                            Business License
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="website"
                            checked={verificationMethods.website}
                            onChange={() => handleVerificationMethodChange('website')}
                            className="h-4 w-4 text-[#00A55F] focus:ring-[#00A55F] border-gray-300 rounded"
                        />
                        <label htmlFor="website" className="ml-2 block text-sm text-gray-700">
                            Company Website
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="social"
                            checked={verificationMethods.social}
                            onChange={() => handleVerificationMethodChange('social')}
                            className="h-4 w-4 text-[#00A55F] focus:ring-[#00A55F] border-gray-300 rounded"
                        />
                        <label htmlFor="social" className="ml-2 block text-sm text-gray-700">
                            Social Media Presence
                        </label>
                    </div>
                </div>
                {errors.verificationMethods && (
                    <p className="mt-1 text-sm text-red-500">{errors.verificationMethods}</p>
                )}
            </div>

            {verificationMethods.social && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                            Social Media Links
                        </label>
                        <button
                            type="button"
                            onClick={handleAddSocialLink}
                            className="text-sm text-[#00A55F] hover:text-[#008c4f]"
                        >
                            + Add Link
                        </button>
                    </div>
                    {socialLinks.map((link, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                                placeholder="Enter social media URL"
                                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveSocialLink(index)}
                                className="px-3 py-2 text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isFreelancer"
                    checked={formData.isFreelancer}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#00A55F] focus:ring-[#00A55F] border-gray-300 rounded"
                />
                <label htmlFor="isFreelancer" className="ml-2 block text-sm text-gray-700">
                    I am a freelancer
                </label>
            </div>
        </div>
    );
};

OrganizationForm.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleLogoChange: PropTypes.func.isRequired,
    handleVerificationMethodChange: PropTypes.func.isRequired,
    handleSocialLinkChange: PropTypes.func.isRequired,
    handleAddSocialLink: PropTypes.func.isRequired,
    handleRemoveSocialLink: PropTypes.func.isRequired,
    industries: PropTypes.array.isRequired,
    cities: PropTypes.array.isRequired,
    employeeRanges: PropTypes.array.isRequired,
    socialLinks: PropTypes.array.isRequired,
    logoPreview: PropTypes.string,
    verificationMethods: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired
};

export default OrganizationForm; 