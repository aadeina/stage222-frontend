import api from './api';

// ✅ Messaging API service for Stage222
// Handles all messaging operations between recruiters and candidates

export const messagingApi = {
    // 📤 Send a message (recruiter to candidate)
    sendMessage: (data) => api.post('/messages/send/', data),

    // 📥 Get messages with a specific user (thread view)
    getMessagesWithUser: (userId) => api.get(`/messages/with/${userId}/`),

    // ✅ Mark a message as read
    markMessageAsRead: (messageId) => api.patch(`/messages/${messageId}/read/`),

    // 📬 Get inbox (latest message per user)
    getInbox: () => api.get('/messages/inbox/'),

    // 🔔 Notify candidate on application acceptance (auto message)
    notifyCandidate: (applicationId, status) =>
        api.patch(`/messages/notify-candidate/${applicationId}/`, { status }),
};

export default messagingApi; 