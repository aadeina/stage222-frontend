import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../features/auth/api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signupData, setSignupData] = useState(null);

    useEffect(() => {
        // Check for stored user data on mount
        const storedUser = localStorage.getItem('user');
        const storedSignupData = localStorage.getItem('signupData');

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('user');
            }
        }

        if (storedSignupData) {
            try {
                setSignupData(JSON.parse(storedSignupData));
            } catch (error) {
                console.error('Error parsing stored signup data:', error);
                localStorage.removeItem('signupData');
            }
        }

        setLoading(false);
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const storeSignupData = (data) => {
        setSignupData(data);
        localStorage.setItem('signupData', JSON.stringify(data));
    };

    const clearSignupData = () => {
        setSignupData(null);
        localStorage.removeItem('signupData');
    };

    const handleLogin = async (credentials) => {
        try {
            const response = await login(credentials);
            const { user, tokens } = response.data;
            updateUser({ ...user, tokens });
            toast.success('Login successful!');
            return user;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const handleRegister = async (userData) => {
        try {
            const response = await register(userData);
            toast.success('Registration successful! Please verify your email.');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const handleLogout = () => {
        setUser(null);
        setSignupData(null);
        localStorage.removeItem('user');
        localStorage.removeItem('signupData');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const value = {
        user,
        loading,
        signupData,
        updateUser,
        storeSignupData,
        clearSignupData,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: !!user,
        isVerified: user?.is_verified || false
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
