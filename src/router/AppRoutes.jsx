import { Routes, Route } from 'react-router-dom';
import RegisterStudent from '@/features/auth/pages/RegisterStudent';
import RegisterEmail from '@/features/auth/pages/RegisterEmail';
import Login from '@/features/auth/pages/Login';
import VerifyOtp from '@/features/auth/pages/VerifyOtp';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import ProtectedRoute from './ProtectedRoute';
import Home from '@/pages/Home'; // Make sure the Home page is at src/pages/Home.jsx
import RecruiterSignup from '@/features/recruiter/pages/RecruiterSignup';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register/student" element={<RegisterStudent />} />
            <Route path="/register/email" element={<RegisterEmail />} />
            <Route path="/register/employer" element={<RecruiterSignup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <div className="text-center mt-10 text-xl font-bold text-green-600">
                            🎉 Welcome to Stage222 Dashboard
                        </div>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
