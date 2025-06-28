# Recruiter Dashboard

A comprehensive dashboard for recruiters built with React, Tailwind CSS, and Framer Motion, inspired by Internshala's employer dashboard.

## Features

### ✅ Dashboard Overview Cards
- **Total Opportunities**: Shows the number of posted jobs/internships
- **Total Applications**: Displays total applications received
- **Shortlisted Candidates**: Shows candidates in shortlist
- **Total Hires**: Displays successful hires

### ✅ Recently Posted Opportunities Table
- Title, Type (Internship/Job), Applicants Count
- Posted Date, Status (Active/Draft/Closed)
- Action buttons: View, Edit, Delete
- Responsive table with hover effects

### ✅ Applications Summary
- Quick access to view all applicants
- Links to `/recruiter/applicants`

### ✅ Chat Shortcut
- Direct access to messaging system
- Links to `/messages`

### ✅ Manage Account Section
- View Profile
- Edit Organization
- Change Password
- Billing
- Logout functionality

## Technical Implementation

### 🔧 Auth & State Management
- Uses global `AuthContext` for user authentication
- Fetches dashboard data from API endpoints
- Fallback to mock data for development
- Proper loading states and error handling

### 🎨 Design Features
- **Responsive Layout**: 1 column (mobile), 2 columns (tablet), 4 columns (desktop)
- **Color Scheme**: Primary color `#00A55F` with hover states
- **Animations**: Framer Motion for smooth card animations
- **Icons**: React Icons (FontAwesome) for consistent iconography

### 🔒 Access Control
- Only accessible to authenticated recruiters
- Redirects non-recruiters to `/login`
- Role-based access control

## API Endpoints

### Dashboard Statistics
```javascript
GET /api/recruiters/dashboard/
```

### Recent Opportunities
```javascript
GET /api/recruiters/opportunities/
```

### Applications Summary
```javascript
GET /api/recruiters/applications/summary/
```

## Components

### RecruiterDashboard.jsx
Main dashboard component with all sections and functionality.

### RecruiterHeader.jsx
Reusable header component with user info and logout functionality.

### dashboardApi.js
API service functions for dashboard data fetching.

## Usage

```jsx
import RecruiterDashboard from './features/recruiter/pages/RecruiterDashboard';

// In your router
<Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
```

## Development

The dashboard uses mock data during development and automatically falls back to it if API calls fail. In production, it will show error messages for failed API calls.

## Styling

Built with Tailwind CSS following the design system:
- Primary color: `#00A55F`
- Hover states: `#008c4f`
- Consistent spacing and typography
- Shadow and border styling for cards 