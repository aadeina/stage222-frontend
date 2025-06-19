import PropTypes from 'prop-types';

const PersonalDetailsForm = ({
    formData,
    errors,
    handleChange,
    handleSendOtp,
    handleVerifyOtp,
    handleOtpChange,
    isSendingOtp,
    isVerifyingOtp,
    showOtpField,
    phoneVerified,
    otp,
    otpTimer,
    canResendOtp,
    handleDesignationChange,
    handleDesignationSelect,
    handleDesignationBlur,
    handleCustomDesignationChange,
    showDesignationDropdown,
    setShowDesignationDropdown,
    designationSearch,
    selectedDesignation,
    showCustomDesignation,
    customDesignation,
    designations,
    isTyping,
    setFormData,
    setCustomDesignation,
    setShowCustomDesignation
}) => {
    return (
        <div className="space-y-4 sm:space-y-6">
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
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
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
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.designation ? 'border-red-500' : 'border-gray-300'} ${selectedDesignation ? 'bg-gray-50' : ''}`}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <svg
                                className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${showDesignationDropdown ? 'rotate-180' : ''}`}
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
        </div>
    );
};

PersonalDetailsForm.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSendOtp: PropTypes.func.isRequired,
    handleVerifyOtp: PropTypes.func.isRequired,
    handleOtpChange: PropTypes.func.isRequired,
    isSendingOtp: PropTypes.bool.isRequired,
    isVerifyingOtp: PropTypes.bool.isRequired,
    showOtpField: PropTypes.bool.isRequired,
    phoneVerified: PropTypes.bool.isRequired,
    otp: PropTypes.string.isRequired,
    otpTimer: PropTypes.number.isRequired,
    canResendOtp: PropTypes.bool.isRequired,
    handleDesignationChange: PropTypes.func.isRequired,
    handleDesignationSelect: PropTypes.func.isRequired,
    handleDesignationBlur: PropTypes.func.isRequired,
    handleCustomDesignationChange: PropTypes.func.isRequired,
    showDesignationDropdown: PropTypes.bool.isRequired,
    setShowDesignationDropdown: PropTypes.func.isRequired,
    designationSearch: PropTypes.string.isRequired,
    selectedDesignation: PropTypes.string,
    showCustomDesignation: PropTypes.bool.isRequired,
    customDesignation: PropTypes.string.isRequired,
    designations: PropTypes.array.isRequired,
    isTyping: PropTypes.bool.isRequired,
    setFormData: PropTypes.func.isRequired,
    setCustomDesignation: PropTypes.func.isRequired,
    setShowCustomDesignation: PropTypes.func.isRequired
};

export default PersonalDetailsForm; 