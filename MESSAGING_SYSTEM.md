# Stage222 Messaging System Implementation

## Overview

The Stage222 messaging system provides real-time communication between recruiters and candidates through a comprehensive Django backend API and React frontend integration. This system enables seamless communication throughout the application process.

## Backend API Endpoints

### 1. Send Message (Recruiter to Candidate)
- **URL**: `POST /api/messages/send/`
- **Method**: POST
- **Authentication**: Required (Recruiter only)
- **Payload**:
```json
{
  "receiver": "<candidate_user_uuid>",
  "internship": "<internship_uuid>",
  "body": "👋 Hello! We're excited to move forward with your application."
}
```
- **Response**: Full message object

### 2. Get Messages with Specific User (Thread View)
- **URL**: `GET /api/messages/with/<user_id>/`
- **Method**: GET
- **Authentication**: Required
- **Response**:
```json
[
  {
    "sender_email": "aadeina1@gmail.com",
    "receiver_email": "example@email.com",
    "body": "👋 Hello!",
    "internship_title": "IOS Engineer",
    "is_read": false,
    "timestamp": "2025-07-04T17:10:38Z"
  }
]
```

### 3. Mark Message as Read
- **URL**: `PATCH /api/messages/<message_id>/read/`
- **Method**: PATCH
- **Authentication**: Required
- **Body**: None required

### 4. Get Inbox (Latest Message per User)
- **URL**: `GET /api/messages/inbox/`
- **Method**: GET
- **Authentication**: Required
- **Response**:
```json
[
  {
    "user_id": "<other_user_uuid>",
    "user_email": "example@email.com",
    "message": "Last message content",
    "timestamp": "2025-07-04T17:10:38Z",
    "is_read": true,
    "internship_title": "IOS Engineer"
  }
]
```

### 5. Notify Candidate on Application Acceptance
- **URL**: `PATCH /api/messages/notify-candidate/<application_id>/`
- **Method**: PATCH
- **Authentication**: Required (Recruiter only)
- **Body**: `{ "status": "accepted" }`

## Frontend Implementation

### 1. Messaging API Service (`src/services/messagingApi.js`)

```javascript
import api from './api';

export const messagingApi = {
    // Send a message (recruiter to candidate)
    sendMessage: (data) => api.post('/messages/send/', data),

    // Get messages with a specific user (thread view)
    getMessagesWithUser: (userId) => api.get(`/messages/with/${userId}/`),

    // Mark a message as read
    markMessageAsRead: (messageId) => api.patch(`/messages/${messageId}/read/`),

    // Get inbox (latest message per user)
    getInbox: () => api.get('/messages/inbox/'),

    // Notify candidate on application acceptance (auto message)
    notifyCandidate: (applicationId, status) => 
        api.patch(`/messages/notify-candidate/${applicationId}/`, { status }),
};
```

### 2. Recruiter Messages Page (`src/features/recruiter/pages/Messages.jsx`)

**Features:**
- Real-time inbox loading from API
- Conversation thread view
- Message sending functionality
- Auto-mark messages as read
- Search and filter conversations
- Responsive design (mobile/desktop)
- Professional UI with Stage222 branding

**Key Functions:**
- `loadInbox()`: Fetches conversations from `/api/messages/inbox/`
- `loadMessages(userId)`: Loads conversation thread from `/api/messages/with/<user_id>/`
- `handleSendMessage()`: Sends messages via `/api/messages/send/`
- Auto-mark unread messages as read when conversation is opened

### 3. Candidate Messages Page (`src/features/candidate/pages/CandidateMessages.jsx`)

**Features:**
- Same functionality as recruiter messages
- Optimized for candidate perspective
- Message status indicators
- Professional Mauritanian-focused UI

### 4. Messaging Modal (`src/features/recruiter/components/MessagingModal.jsx`)

**Features:**
- Quick message sending from applicants page
- Professional modal design
- Real-time message sending
- Error handling and loading states

### 5. Integration Points

#### Recruiter Applicants Page
- Added "Message" button to each applicant row
- Opens messaging modal for quick communication
- Integrates with candidate profile data

#### Candidate Applications Page
- Added "Message" button for contacting recruiters
- Modal-based messaging interface
- Links to specific internship applications

## User Experience Features

### 1. Real-time Communication
- Instant message sending
- Real-time conversation updates
- Message status indicators (sending, delivered, read)

### 2. Professional UI/UX
- Stage222 brand colors (#00A55F, #008c4f)
- Responsive design for all devices
- Smooth animations with Framer Motion
- Loading states and error handling

### 3. Message Management
- Inbox view with latest messages
- Conversation threading
- Search and filter functionality
- Unread message indicators

### 4. Integration with Application Process
- Context-aware messaging (linked to internships)
- Automatic candidate notifications
- Seamless workflow integration

## Technical Implementation Details

### 1. Authentication
- Uses existing JWT token system
- Automatic token refresh handling
- Secure API communication

### 2. Data Transformation
- API data transformed to match UI requirements
- Consistent data structure across components
- Error handling for missing data

### 3. State Management
- React hooks for local state
- Optimistic UI updates
- Proper loading and error states

### 4. Performance Optimization
- Efficient API calls
- Minimal re-renders
- Smooth animations

## Usage Examples

### For Recruiters
1. **View Messages**: Navigate to `/recruiter/messages`
2. **Send Message from Applicants**: Click "Message" button on applicant row
3. **Auto-notify Candidates**: Use application status updates

### For Candidates
1. **View Messages**: Navigate to `/candidate/messages`
2. **Contact Recruiter**: Click "Message" button on application row
3. **Receive Notifications**: Automatic messages for application updates

## Error Handling

### 1. API Errors
- Network error handling
- Authentication error recovery
- User-friendly error messages

### 2. UI Error States
- Loading spinners
- Error toast notifications
- Graceful fallbacks

### 3. Data Validation
- Message content validation
- Required field checking
- Input sanitization

## Future Enhancements

### 1. Real-time Features
- WebSocket integration for live messaging
- Typing indicators
- Online status indicators

### 2. Advanced Features
- File attachments
- Message reactions
- Message threading
- Message search

### 3. Mobile Optimization
- Push notifications
- Mobile app integration
- Offline message queuing

## Testing

### 1. Manual Testing
- Test all messaging flows
- Verify API integration
- Check responsive design
- Validate error handling

### 2. API Testing
- Test all endpoints
- Verify authentication
- Check data validation
- Test error scenarios

## Deployment Notes

### 1. Environment Variables
- Ensure API base URL is configured
- Verify authentication tokens
- Check CORS settings

### 2. Database
- Ensure message tables are migrated
- Verify indexes for performance
- Check data integrity

### 3. Security
- Validate authentication on all endpoints
- Check message permissions
- Verify data sanitization

## Support

For technical support or questions about the messaging system:
- Check API documentation
- Review error logs
- Test with sample data
- Contact development team

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready ✅ 