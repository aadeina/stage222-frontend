import api from '@/services/api';

/**
 * =============================
 * Admin Analytics API
 * =============================
 */

/** Get overall platform statistics */
export const fetchPlatformStats = () => api.get('/admin/stats/');

/** Get daily growth summary */
export const fetchDailyGrowthSummary = () => api.get('/admin/activity/summary/');

/** Get top internships */
export const fetchTopInternships = () => api.get('/admin/top-internships/');

/** Get top recruiters */
export const fetchTopRecruiters = () => api.get('/admin/top-recruiters/');

/** Get top skills */
export const fetchTopSkills = () => api.get('/admin/top-skills/');

/** Get shortlist rate */
export const fetchShortlistRate = () => api.get('/admin/shortlist-rate/');

/**
 * =============================
 * Admin User Management API
 * =============================
 */

/** List all users */
export const fetchAdminUsers = () => api.get('/admin/users/');

/** Toggle user verification */
export const toggleVerifyUser = (id) => api.post(`/admin/users/${id}/verify/`);

/** Toggle user active status */
export const toggleActiveUser = (id) => api.post(`/admin/users/${id}/deactivate/`);

/** Delete a user */
export const deleteUser = (id) => api.delete(`/admin/users/${id}/delete/`);

/** Change user role */
export const changeUserRole = (id, data) => api.post(`/admin/users/${id}/role/`, data);

/**
 * =============================
 * Internship Moderation API
 * =============================
 */

/** List all pending internships */
export const fetchPendingInternships = () => api.get('/admin/internships/pending/');

/** Approve an internship */
export const approveInternship = (id) => api.post(`/admin/internships/${id}/approve/`);

/** Reject an internship */
export const rejectInternship = (id) => api.post(`/admin/internships/${id}/reject/`);

/** Toggle organization verification */
export const toggleVerifyOrganization = (id) => api.post(`/admin/organizations/${id}/toggle-verify/`); 