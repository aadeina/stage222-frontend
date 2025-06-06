import api from './api';

// POST /auth/register/
export const registerUser = (formData) => {
    return api.post('/auth/register/', formData);
};

// POST /auth/login/
export const loginUser = (formData) => {
    return api.post('/auth/login/', formData);
};

// POST /auth/verify-otp/
export const verifyOtp = (email, otp) => {
    return api.post('/auth/verify-otp/', { email, otp });
};

// POST /auth/resend-otp/
export const resendOtp = (email) => {
    return api.post('/auth/resend-otp/', { email });
};

// POST /auth/reset-password/
export const resetPassword = (data) => {
    return api.post('/auth/reset-password-confirm/', data);
};

// ✅ Recruiter phone OTP (add these)
export const sendOtp = (phone, lang = 'fr') => {
    return api.post('/recruiters/send-otp/', { phone, lang });
};

export const verifyRecruiterOtp = (phone, otp) => {
    return api.post('/recruiters/verify-otp/', { phone, otp });
};