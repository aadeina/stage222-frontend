// src/services/organizationApi.js
import api from './api';

/**
 * Create a new organization
 * POST /organizations/
 */
export const createOrganization = (formData) => {
  return api.post('/organizations/create/', formData);
};

/**
 * Update an existing organization by ID
 * PUT /organizations/:id/update/
 */
export const updateOrganization = (id, formData) => {
  return api.put(`/organizations/${id}/update/`, formData);
};

/**
 * Fetch all organizations (admin or dashboard use)
 * GET /organizations/
 */
export const fetchAllOrganizations = () => {
  return api.get('/organizations/');
};

/**
 * Fetch a specific organization by ID
 * GET /organizations/:id/
 */
export const fetchOrganizationById = (id) => {
  return api.get(`/organizations/${id}/`);
};
