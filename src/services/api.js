// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Authorization header with JWT token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // If the request contains FormData, don't set Content-Type
    // Let the browser set it with the boundary
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api; // ✅ default export

export const authApi = {
    login: (credentials) => api.post('/auth/login/', credentials),
    register: (userData) => api.post('/auth/register/', userData),
    verifyOtp: (email, code) => api.post('/auth/verify-otp/', { email, code }),
};
