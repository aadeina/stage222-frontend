import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '@/pages/Home';
import Login from '@/features/auth/pages/Login';
import RegisterStudent from '@/features/auth/pages/RegisterStudent';
import RegisterEmail from '@/features/auth/pages/RegisterEmail';
import RecruiterSignup from '@/features/auth/pages/RecruiterSignup';
import VerifyOtp from '@/features/auth/pages/VerifyOtp';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register/student" element={<RegisterStudent />} />
                <Route path="/register/email" element={<RegisterEmail />} />
                <Route path="/register/employer" element={<RecruiterSignup />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;
