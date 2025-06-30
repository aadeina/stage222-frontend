import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import InternshipList from '@/pages/candidate/InternshipList';
import InternshipDetail from '@/pages/candidate/InternshipDetail';

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
import StudentDashboard from '@/features/candidate/pages/StudentDashboard';
import EditOpportunity from '@/features/recruiter/pages/EditOpportunity';

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

                {/* Recruiter Onboarding Route */}
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

                {/* Recruiter Dashboard Route */}
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

                {/* Recruiter Post Opportunity Route */}
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

                {/* Edit Organization Route */}
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

                {/* Alternative Edit Organization Route (without ID parameter) */}
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

                {/* Recruiter Pricing Route */}
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

                {/* Student Dashboard Route */}
                <Route
                    path="/dashboard/student"
                    element={
                        <ProtectedRoute>
                            <PageWrapper>
                                <StudentDashboard />
                            </PageWrapper>
                        </ProtectedRoute>
                    }
                />

                {/* Edit Opportunity Route */}
                <Route path="/recruiter/edit-opportunity/:id" element={<EditOpportunity />} />

                {/* Recruiter Profile Route */}
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

            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;
