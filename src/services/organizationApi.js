// src/services/organizationApi.js
import api from './api';

// POST /organizations/create/
export const createOrganization = (formData) => {
    return api.post('/organizations/create/', formData);
};

// PUT /organizations/:id/update/
export const updateOrganization = (id, formData) => {
    return api.put(`/organizations/${id}/update/`, formData);
};

// GET /organizations/
export const fetchAllOrganizations = () => {
    return api.get('/organizations/');
};

// GET /organizations/:id/
export const fetchOrganizationById = (id) => {
    return api.get(`/organizations/${id}/`);
};
