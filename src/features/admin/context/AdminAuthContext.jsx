import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/adminAuthApi';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
            try {
                setAdmin(JSON.parse(storedAdmin));
            } catch {
                localStorage.removeItem('admin');
            }
        }
        setLoading(false);
    }, []);

    const updateAdmin = (adminData) => {
        setAdmin(adminData);
        localStorage.setItem('admin', JSON.stringify(adminData));
    };

    const handleAdminLogin = async (credentials) => {
        try {
            const res = await adminLogin(credentials);
            const { user, access, refresh, tokens } = res.data;
            // Only allow admin role
            if (!user || user.role !== 'admin') {
                toast.error('Not an admin account.');
                throw new Error('Not an admin account.');
            }
            const accessToken = tokens?.access || access;
            const refreshToken = tokens?.refresh || refresh;
            if (accessToken) localStorage.setItem('admin_token', accessToken);
            if (refreshToken) localStorage.setItem('admin_refresh_token', refreshToken);
            updateAdmin({ ...user, tokens: { access: accessToken, refresh: refreshToken } });
            toast.success('Admin login successful!');
            return { ...user, tokens: { access: accessToken, refresh: refreshToken } };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Admin login failed');
            throw error;
        }
    };

    const handleAdminLogout = () => {
        setAdmin(null);
        localStorage.removeItem('admin');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh_token');
        navigate('/admin/login');
        toast.success('Logged out successfully');
    };

    const value = {
        admin,
        loading,
        login: handleAdminLogin,
        logout: handleAdminLogout,
        isAuthenticated: !!admin,
        isVerified: admin?.is_verified || false,
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {!loading && children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}; 