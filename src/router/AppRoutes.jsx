import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import InternshipList from '@/pages/candidate/InternshipList';
import InternshipDetail from '@/pages/candidate/InternshipDetail';
import RecruiterOpportunities from '@/pages/candidate/RecruiterOpportunities';

// Public Pages
import Home from '@/pages/Home';
import Login from '@/features/auth/pages/Login';
import RegisterStudent from '@/features/auth/pages/RegisterStudent';
import RecruiterSignup from '@/features/auth/pages/RecruiterSignup';
import VerifyOtp from '@/features/auth/pages/VerifyOtp';
import ResetPassword from '@/features/auth/pages/ResetPassword';

// Protected Pages
import ProtectedRoute from './ProtectedRoute';
import RecruiterOnboarding from '@/features/recruiter/pages/RecruiterOnboarding';
import ProtectedOnboardingRoute from '@/features/recruiter/components/ProtectedOnboardingRoute';
import PostInternshipJob from '@/features/recruiter/pages/PostInternshipJob';
import RecruiterDashboard from '@/features/recruiter/pages/RecruiterDashboard';
import EditOrganization from '@/features/recruiter/pages/EditOrganization';
import RecruiterPricing from '@/features/recruiter/pages/RecruiterPricing';
import RecruiterProfile from '@/features/recruiter/pages/RecruiterProfile';
import ChangePassword from '../features/candidate/pages/ChangePassword';
import RecruiterBilling from '@/features/recruiter/pages/RecruiterBilling';
import CandidateDashboard from '@/features/candidate/pages/CandidateDashboard';
import EditOpportunity from '@/features/recruiter/pages/EditOpportunity';
import Messages from '@/features/recruiter/pages/Messages';
import CandidateMessages from '../features/candidate/pages/CandidateMessages';
import CandidateApplications from '../features/candidate/pages/CandidateApplications';
import CandidateBookmarks from '../features/candidate/pages/CandidateBookmarks';
import CandidateResume from '../features/candidate/pages/CandidateResume';
import CandidatePreferences from '../features/candidate/pages/CandidatePreferences';

// Admin Pages
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import UserManagement from '@/features/admin/pages/UserManagement';
import InternshipModeration from '@/features/admin/pages/InternshipModeration';
import AdminLogin from '@/features/admin/pages/AdminLogin';
import { AdminAuthProvider, useAdminAuth } from '@/features/admin/context/AdminAuthContext';
import OrganizationModeration from '@/features/admin/pages/OrganizationModeration';

// RequireAdmin wrapper for admin routes
function RequireAdmin({ children }) {
    const { admin, loading } = useAdminAuth();
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    if (!admin || admin.role !== 'admin') {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
}

const AppRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            {/* Admin context wraps all admin routes */}
            <AdminAuthProvider>
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
                    <Route
                        path="/internships"
                        element={
                            <PageWrapper>
                                <InternshipList />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/internships/:id"
                        element={
                            <PageWrapper>
                                <InternshipDetail />
                            </PageWrapper>
                        }
                    />

                    {/* Protected Routes */}
                    <Route
                        path="/recruiter/onboarding"
                        element={
                            <ProtectedOnboardingRoute>
                                <PageWrapper>
                                    <RecruiterOnboarding />
                                </PageWrapper>
                            </ProtectedOnboardingRoute>
                        }
                    />
                    <Route
                        path="/recruiter/dashboard"
                        element={
                            <ProtectedRoute>
                                <PageWrapper>
                                    <RecruiterDashboard />
                                </PageWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recruiter/post-opportunity"
                        element={
                            <ProtectedRoute>
                                <PageWrapper>
                                    <PostInternshipJob />
                                </PageWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recruiter/messages"
                        element={
                            <ProtectedRoute>
                                <PageWrapper>
                                    <Messages />
                                </PageWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recruiter/:recruiterId/opportunities"
                        element={
                            <PageWrapper>
                                <RecruiterOpportunities />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/recruiter/organization/:id/update"
                        element={
                            <ProtectedRoute>
                                <PageWrapper>
                                    <EditOrganization />
                                </PageWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recruiter/organization/edit"
                        element={
                            <ProtectedRoute>
                                <PageWrapper>
                                    <EditOrganization />
                                </PageWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recruiter/pricing"
                        element={
                            <ProtectedRoute>
                                <PageWrapper>
                                    <RecruiterPricing />
                                </PageWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/candidate/dashboard"
                        element={
                            <ProtectedRoute>
                                <PageWrapper>
                                    <CandidateDashboard />
                                </PageWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/recruiter/edit-opportunity/:id" element={<EditOpportunity />} />
                    <Route
                        path="/recruiter/profile"
                        element={
                            <ProtectedRoute>
                                <PageWrapper>
                                    <RecruiterProfile />
                                </PageWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recruiter/change-password"
                        element={
                            <ProtectedRoute>
                                <PageWrapper>
                                    <ChangePassword />
                                </PageWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recruiter/billing"
                        element={
                            <ProtectedRoute>
                                <PageWrapper>
                                    <RecruiterBilling />
                                </PageWrapper>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/candidate/messages"
                        element={
                            <PageWrapper>
                                <CandidateMessages />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/candidate/applications"
                        element={
                            <PageWrapper>
                                <CandidateApplications />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/candidate/bookmarks"
                        element={
                            <PageWrapper>
                                <CandidateBookmarks />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/candidate/resume"
                        element={
                            <PageWrapper>
                                <CandidateResume />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/candidate/preferences"
                        element={
                            <PageWrapper>
                                <CandidatePreferences />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/candidate/change-password"
                        element={
                            <PageWrapper>
                                <ChangePassword />
                            </PageWrapper>
                        }
                    />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <RequireAdmin>
                                <AdminDashboard />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <RequireAdmin>
                                <UserManagement />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/admin/internships"
                        element={
                            <RequireAdmin>
                                <InternshipModeration />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/admin/organizations"
                        element={
                            <RequireAdmin>
                                <OrganizationModeration />
                            </RequireAdmin>
                        }
                    />
                </Routes>
            </AdminAuthProvider>
        </AnimatePresence>
    );
};

export default AppRoutes;
