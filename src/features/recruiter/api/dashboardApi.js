import api from '../../../services/api';

// Get dashboard statistics
export const getDashboardStats = () => {
    return api.get('/recruiters/dashboard/');
};

// Get recent opportunities
export const getRecentOpportunities = () => {
    return api.get('/recruiters/opportunities/');
};

// Get applications summary
export const getApplicationsSummary = () => {
    return api.get('/recruiters/applications/summary/');
}; 