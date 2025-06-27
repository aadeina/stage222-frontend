import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { requestResetPassword, resetPassword } from '@/services/authApi';
import { toast } from 'react-hot-toast';

const OTP_LENGTH = 6;

const ResetPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [errors, setErrors] = useState({});
    const inputRefs = useRef([]);

    // Countdown for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Handle OTP input
    const handleOtpChange = (e, idx) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (!val) {
            setOtp(prev => prev.map((d, i) => (i === idx ? '' : d)));
            return;
        }
        if (val.length === 1) {
            setOtp(prev => prev.map((d, i) => (i === idx ? val : d)));
            if (idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData.getData('Text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
        if (pasted.length === OTP_LENGTH) {
            setOtp(pasted.split(''));
            inputRefs.current[OTP_LENGTH - 1]?.focus();
        }
        e.preventDefault();
    };

    // Validation functions
    const validateEmail = () => {
        if (!email) {
            setErrors({ email: 'Email is required' });
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: 'Please enter a valid email' });
            return false;
        }
        setErrors({});
        return true;
    };

    const validatePassword = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!validateEmail()) return;

        setIsLoading(true);
        try {
            await requestResetPassword(email);
            toast.success('📧 OTP sent to your email!');
            setStep(2);
            setCountdown(60);
        } catch (error) {
            toast.error(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                'Failed to send OTP. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== OTP_LENGTH) {
            toast.error('Please enter the 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            // For step 2, we just validate the OTP format and move to step 3
            // The actual verification happens in step 3 with the password
            setStep(3);
        } catch (error) {
            toast.error('Invalid OTP format. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        const code = otp.join('');
        if (code.length !== OTP_LENGTH) {
            toast.error('Please enter the 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword({
                email,
                code,
                password
            });
            toast.success('✅ Password reset successfully!');
            navigate('/login');
        } catch (error) {
            toast.error(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                'Failed to reset password. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResend = async () => {
        if (!email) {
            toast.error('Email not found');
            return;
        }
        setIsResending(true);
        try {
            await requestResetPassword(email);
            toast.success('📩 OTP resent to your email.');
            setCountdown(60);
        } catch (error) {
            toast.error(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                'Failed to resend OTP'
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-600">
                        {step === 1 && 'Enter your email to receive a reset code'}
                        {step === 2 && `Enter the OTP sent to ${email.replace(/(.{3}).*(@.*)/, '$1***$2')}`}
                        {step === 3 && 'Create your new password'}
                    </p>
                </motion.div>

                {/* Step 1: Email Input */}
                {step === 1 && (
                    <motion.form
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onSubmit={handleSendOtp}
                        className="space-y-6"
                    >
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <motion.input
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({});
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email address"
                            />
                            {errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-500"
                                >
                                    {errors.email}
                                </motion.p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: !isLoading ? 1.02 : 1 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg font-semibold transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#008c4f]'
                                }`}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Code'}
                        </motion.button>
                    </motion.form>
                )}

                {/* Step 2: OTP Input */}
                {step === 2 && (
                    <motion.form
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onSubmit={handleVerifyOtp}
                        className="space-y-6"
                    >
                        <div className="flex justify-center gap-2 mb-4" onPaste={handleOtpPaste}>
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => (inputRefs.current[idx] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                                    value={digit}
                                    onChange={e => handleOtpChange(e, idx)}
                                    onKeyDown={e => handleOtpKeyDown(e, idx)}
                                    autoFocus={idx === 0}
                                    aria-label={`OTP digit ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: otp.join('').length === OTP_LENGTH && !isLoading ? 1.02 : 1 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading || otp.join('').length !== OTP_LENGTH}
                            className={`w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg font-semibold transition-colors ${isLoading || otp.join('').length !== OTP_LENGTH
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:bg-[#008c4f]'
                                }`}
                        >
                            {isLoading ? 'Verifying...' : 'Continue'}
                        </motion.button>

                        <div className="flex flex-col items-center gap-2">
                            <motion.button
                                whileHover={{ scale: !isResending && countdown === 0 ? 1.05 : 1 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={handleResend}
                                disabled={isResending || countdown > 0}
                                className="text-sm text-[#00A55F] hover:text-[#008c4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResending
                                    ? 'Sending...'
                                    : countdown > 0
                                        ? `Resend in ${countdown}s`
                                        : "Didn't receive the code? Resend"}
                            </motion.button>
                        </div>
                    </motion.form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <motion.form
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onSubmit={handleResetPassword}
                        className="space-y-6"
                    >
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <motion.input
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: '' });
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter new password"
                            />
                            {errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-500"
                                >
                                    {errors.password}
                                </motion.p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <motion.input
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Confirm new password"
                            />
                            {errors.confirmPassword && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-500"
                                >
                                    {errors.confirmPassword}
                                </motion.p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: !isLoading ? 1.02 : 1 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg font-semibold transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#008c4f]'
                                }`}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </motion.button>
                    </motion.form>
                )}

                {/* Back to Login */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-center"
                >
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline"
                    >
                        Back to Login
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
