import api from '@/services/api';

export const register = (data) => api.post('/auth/register/', data);
export const login = (data) => api.post('/auth/login/', data);
export const verifyOtp = (data) => api.post('/auth/verify-otp/', data);
export const resendOtp = (email) => api.post('/auth/resend-otp/', { email });
export const requestPasswordReset = (email) => api.post('/auth/request-password-reset/', { email });
export const resetPassword = (data) => api.post('/auth/reset-password/', data);
