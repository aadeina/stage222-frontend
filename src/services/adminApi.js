import axios from "axios";

// Create the adminApi instance
const adminApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Create a separate instance for login (no auth required)
const loginApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Always use the admin_token from localStorage
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Admin login endpoint - uses loginApi (no auth required)
export const adminLogin = (credentials) => loginApi.post('/auth/login/', credentials);

// =============================
// Analytics Endpoints
// =============================
export const fetchPlatformStats = () => adminApi.get('/admin/stats/');
export const fetchDailyGrowthSummary = () => adminApi.get('/admin/activity/summary/');
export const fetchTopInternships = () => adminApi.get('/admin/top-internships/');
export const fetchTopRecruiters = () => adminApi.get('/admin/top-recruiters/');
export const fetchTopSkills = () => adminApi.get('/admin/top-skills/');
export const fetchShortlistRate = () => adminApi.get('/admin/shortlist-rate/');

// Advanced Analytics Endpoints
export const fetchGrowthAnalytics = () => adminApi.get('/admin/analytics/growth/');
export const fetchEngagementAnalytics = () => adminApi.get('/admin/analytics/engagement/');
export const fetchConversionAnalytics = () => adminApi.get('/admin/analytics/conversions/');
export const fetchTopUsersAnalytics = () => adminApi.get('/admin/analytics/top-users/');

// =============================
// User Management Endpoints
// =============================
export const fetchAdminUsers = () => adminApi.get('/admin/users/');
export const toggleVerifyUser = (id) => adminApi.post(`/admin/users/${id}/verify/`);
export const toggleActiveUser = (id) => adminApi.post(`/admin/users/${id}/deactivate/`);
export const deleteUser = (id) => adminApi.delete(`/admin/users/${id}/delete/`);
export const changeUserRole = (id, data) => adminApi.post(`/admin/users/${id}/role/`, data);

// =============================
// Internship Approval Endpoints
// =============================
export const fetchPendingInternships = () => adminApi.get('/admin/internships/pending/');
export const approveInternship = (id) => adminApi.patch(`/admin/internships/${id}/approve/`);
export const rejectInternship = (id, reason) => adminApi.patch(`/admin/internships/${id}/reject/`, { reason });
export const toggleVerifyOrganization = (id) => adminApi.patch(`/admin/organizations/${id}/toggle-verify/`);

// Fetch all organizations for admin moderation
export const fetchAdminOrganizations = () => adminApi.get('/admin/organizations/');

export default adminApi;
