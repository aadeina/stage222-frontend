import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedOnboardingRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A55F]"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user is not a candidate, redirect to appropriate dashboard
    if (user.role !== 'candidate') {
        if (user.role === 'recruiter') {
            return <Navigate to="/recruiter/dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    // If user has already completed onboarding, redirect to dashboard
    if (user.is_onboarding === false) {
        return <Navigate to="/candidate/dashboard" replace />;
    }

    return children;
};

export default ProtectedOnboardingRoute; 