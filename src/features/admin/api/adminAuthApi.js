import api from '@/services/api';

/**
 * Admin login API - only for admin users
 * @param {Object} credentials - { email, password }
 * @returns {Promise}
 */
export const adminLogin = (credentials) => api.post('/auth/login/', credentials); 