import api from '@/services/api';

// Get candidate profile
export const getCandidateProfile = async () => {
    const response = await api.get('/candidates/me/');
    return response.data;
};

// Update candidate profile
export const updateCandidateProfile = async (profileData) => {
    const response = await api.put('/candidates/me/update/', profileData);
    return response.data;
};

// Complete candidate onboarding
export const completeCandidateOnboarding = async (onboardingData) => {
    const response = await api.post('/candidates/onboarding/', onboardingData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Get candidate applications
export const getCandidateApplications = async () => {
    const response = await api.get('/candidates/applications/');
    return response.data;
};

// Get candidate bookmarks
export const getCandidateBookmarks = async () => {
    const response = await api.get('/candidates/bookmarks/');
    return response.data;
};

// Apply to internship
export const applyToInternship = async (internshipId, applicationData) => {
    const response = await api.post(`/internships/${internshipId}/apply/`, applicationData);
    return response.data;
};

// Bookmark/unbookmark internship
export const toggleBookmark = async (internshipId) => {
    const response = await api.post(`/internships/${internshipId}/bookmark/`);
    return response.data;
};

// Update candidate resume
export const updateCandidateResume = async (resumeFile) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    const response = await api.post('/candidates/me/resume/', formData);
    return response.data;
};

// Fetch all skills for autocomplete
export const getAllSkills = async () => {
    const response = await api.get('/candidates/skills/');
    return response.data;
};

// Update candidate skills
export const updateCandidateSkills = async (skillIds) => {
    const response = await api.post('/candidates/me/skills/', { skills: skillIds });
    return response.data;
};

// Delete a skill by name
export const deleteCandidateSkill = async (skillName) => {
    const response = await api.delete(`/candidates/me/skills/${encodeURIComponent(skillName)}/`);
    return response.data;
};
