import api from '../../../services/api';

export const submitRecruiterOnboarding = (data) => {
    return api.post('/recruiters/onboarding/', data);
}; 