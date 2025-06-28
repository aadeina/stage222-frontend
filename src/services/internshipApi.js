// src/services/internshipApi.js
import api from './api'; // axios instance with baseURL

// 🌍 Public: Get all approved + open internships
export const fetchInternships = () => api.get('/internships/');

// 📄 Get internship details
export const getInternshipDetail = (id) => api.get(`/internships/${id}/`);

// 🧑‍💼 Create internship (Recruiter)
export const createInternship = (data) => api.post('/internships/create/', data);

// 🧑‍💼 Get own internships
export const fetchMyInternships = () => api.get('/internships/me/');

// 📩 Apply to internship
export const applyToInternship = (id, formData) =>
  api.post(`/internships/${id}/apply/`, formData);

// ✅ Admin: Approve or Reject
export const approveInternship = (id) => api.patch(`/internships/${id}/approve/`, { approve: true });
export const rejectInternship = (id, reason) => api.patch(`/internships/${id}/approve/`, { approve: false, reason });
