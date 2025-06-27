import api from '../../../services/api';

// Register user
export const register = (userData) => api.post('/auth/register/', userData);

// Login user
export const login = (credentials) => api.post('/auth/login/', credentials);

// Verify OTP
export const verifyOtp = (email, code) => api.post('/auth/verify-otp/', { email, code });

// Resend OTP
export const resendOtp = (email) => api.post('/auth/resend-otp/', { email });

// Request Password Reset (send OTP)
export const requestResetPassword = async ({ email }) => {
    const response = await api.post("/auth/password-reset-request/", { email });
    return response.data;
};

// Verify Reset OTP & Set New Password
export const resetPassword = async (data) => {
    const response = await api.post("/auth/password-reset-confirm", data);
    return response.data;
};
