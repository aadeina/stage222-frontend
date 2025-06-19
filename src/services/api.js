import axios from 'axios';

// ✅ Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Define endpoints that do NOT require authentication
const publicEndpoints = [
  '/auth/register/',
  '/auth/login/',
  '/auth/verify-otp/',
  '/auth/resend-otp/',
  '/recruiters/send-otp/',
  '/recruiters/verify-otp/',
];

// ✅ Attach token only to protected endpoints
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const isPublic = publicEndpoints.some((endpoint) => config.url.includes(endpoint));

  if (token && !isPublic) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // 🧠 Let browser handle FormData content-type
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// ✅ Response interceptor for auto-refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔁 Auto-refresh token on expiration (only once per request)
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = res.data.access;
        localStorage.setItem('token', newAccessToken);

        // 🔐 Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // ⛔ Force re-login
      }
    }

    api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const isPublic = publicEndpoints.some((endpoint) =>
    config.url.includes(endpoint)
  );

  if (token && !isPublic) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});


    // Log all other errors
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

// ✅ Grouped auth-related API calls
export const authApi = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  verifyOtp: (email, code) => api.post('/auth/verify-otp/', { email, code }),
  resendOtp: (email) => api.post('/auth/resend-otp/', { email }),
  sendOtp: (phone, lang = 'fr') => api.post('/recruiters/send-otp/', { phone, lang }),
  verifyRecruiterOtp: (phone, otp) => api.post('/recruiters/verify-otp/', { phone, otp }),
};
