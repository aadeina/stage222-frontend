import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';

// Public Pages
import Home from '@/pages/Home';
import Login from '@/features/auth/pages/Login';
import RegisterStudent from '@/features/auth/pages/RegisterStudent';
import RecruiterSignup from '@/features/auth/pages/RecruiterSignup';
import VerifyOtp from '@/features/auth/pages/VerifyOtp';
import ResetPassword from '@/features/auth/pages/ResetPassword';

// Protected Pages
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <PageWrapper>
                            <Home />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PageWrapper>
                            <Login />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/register/student"
                    element={
                        <PageWrapper>
                            <RegisterStudent />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/register/employer"
                    element={
                        <PageWrapper>
                            <RecruiterSignup />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/verify-otp"
                    element={
                        <PageWrapper>
                            <VerifyOtp />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        <PageWrapper>
                            <ResetPassword />
                        </PageWrapper>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <PageWrapper>
                                <Dashboard />
                            </PageWrapper>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;
