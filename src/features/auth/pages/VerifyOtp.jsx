import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerifyOtp = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState({});
    const [isResending, setIsResending] = useState(false);

    // Mock email for demo - in real app, this would come from state/context
    const maskedEmail = 'john***@gmail.com';

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return; // Prevent multiple digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
            if (nextInput) nextInput.focus();
        }

        // Clear error when user types
        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: '' }));
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
            if (prevInput) prevInput.focus();
        }
    };

    const validateOtp = () => {
        if (otp.some(digit => !digit)) {
            setErrors({ otp: 'Please enter the complete OTP' });
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateOtp()) {
            console.log('OTP submitted:', otp.join(''));
        }
    };

    const handleResend = () => {
        setIsResending(true);
        // Simulate API call
        setTimeout(() => {
            setIsResending(false);
            console.log('OTP resent');
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Verify your email
                    </h1>
                    <p className="text-gray-600">
                        Enter the OTP sent to {maskedEmail}
                    </p>
                </motion.div>

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <motion.input
                                key={index}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                type="text"
                                name={`otp-${index}`}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.otp ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                maxLength={1}
                                pattern="[0-9]"
                                inputMode="numeric"
                            />
                        ))}
                    </div>

                    {errors.otp && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500 text-center"
                        >
                            {errors.otp}
                        </motion.p>
                    )}

                    {/* Verify Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium"
                    >
                        Verify
                    </motion.button>

                    {/* Resend Link */}
                    <div className="text-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-sm text-[#00A55F] hover:text-[#008c4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResending ? 'Sending...' : "Didn't receive the OTP? Resend"}
                        </motion.button>
                    </div>
                </form>

                {/* Back to Login */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-center"
                >
                    <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        Back to Login
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default VerifyOtp;
