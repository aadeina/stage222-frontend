import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/features/admin/context/AdminAuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { admin, loading } = useAdminAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!admin) {
        return <Navigate to="/admin/login" replace />;
    }

    if (admin.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">🚫</div>
                    <div className="text-lg font-bold text-red-600 mb-2">Not Authorized</div>
                    <div className="text-gray-600">You do not have permission to access this page.</div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedAdminRoute; 