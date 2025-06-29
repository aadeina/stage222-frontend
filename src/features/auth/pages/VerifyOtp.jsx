import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { verifyOtp, resendOtp } from '@/services/authApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const OTP_LENGTH = 6;

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const email = location.state?.email;
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef([]);

    // Countdown for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Handle OTP input
    const handleChange = (e, idx) => {
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

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('Text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
        if (pasted.length === OTP_LENGTH) {
            setOtp(pasted.split(''));
            inputRefs.current[OTP_LENGTH - 1]?.focus();
        }
        e.preventDefault();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== OTP_LENGTH) {
            toast.error('Please enter the 6-digit OTP');
            return;
        }
        setIsVerifying(true);
        try {
            const response = await verifyOtp(email, code);
            const { user, access, refresh } = response.data;

            // ✅ Save tokens in localStorage
            localStorage.setItem('token', access);
            localStorage.setItem('refresh_token', refresh);

            // ✅ Update auth context
            updateUser({
                ...user,
                is_verified: true
            });

            toast.success('Email verified successfully!');

            // ✅ Redirect based on role
            if (user.role === 'recruiter') {
                if (user.is_onboarding) {
                    navigate('/recruiter/dashboard');
                } else {
                    navigate('/recruiter/onboarding');
                }
            } else if (user.role === 'candidate') {
                navigate('/candidate/dashboard');
            } else {
                navigate('/login');
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                'Verification failed. Please try again.'
            );
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error('Email not found in context');
            return;
        }
        setIsResending(true);
        try {
            await resendOtp(email);
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

    // Only show unauthorized message if directly accessing the page without email
    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Invalid Verification Link
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Please register first to verify your email.
                    </p>
                    <button
                        onClick={() => navigate('/register/student')}
                        className="bg-[#00A55F] text-white px-6 py-2 rounded-lg hover:bg-[#008c4f] transition-colors"
                    >
                        Go to Registration
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Verify your email
                </h1>
                <p className="text-gray-600 mb-6 text-center">
                    Enter the OTP sent to <span className="font-medium">{email.replace(/(.{3}).*(@.*)/, '$1***$2')}</span>
                </p>
                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
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
                                onChange={e => handleChange(e, idx)}
                                onKeyDown={e => handleKeyDown(e, idx)}
                                autoFocus={idx === 0}
                                aria-label={`OTP digit ${idx + 1}`}
                            />
                        ))}
                    </div>
                    <motion.button
                        whileHover={{ scale: otp.join('').length === OTP_LENGTH && !isVerifying ? 1.03 : 1 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isVerifying || otp.join('').length !== OTP_LENGTH}
                        className={`w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg font-semibold transition-colors ${isVerifying || otp.join('').length !== OTP_LENGTH
                            ? 'opacity-70 cursor-not-allowed'
                            : 'hover:bg-[#008c4f]'
                            }`}
                    >
                        {isVerifying ? 'Verifying...' : 'Verify'}
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
                                    : "Didn't receive the OTP? Resend"}
                        </motion.button>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-gray-500 text-xs underline mt-2"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyOtp;
