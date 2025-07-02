import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ProtectedOnboardingRoute = ({ children }) => {
    const { user } = useAuth();

    // If user is not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user is not a recruiter, redirect to appropriate dashboard
    if (user.role !== 'recruiter') {
        return <Navigate to="/candidate/dashboard" replace />;
    }

    // If user's onboarding is complete, redirect to recruiter dashboard
    if (user.is_onboarding) {
        return <Navigate to="/recruiter/dashboard" replace />;
    }

    // If all checks pass, render the onboarding component
    return children;
};

export default ProtectedOnboardingRoute; 