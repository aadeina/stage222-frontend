import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signupData, setSignupData] = useState(null);

    useEffect(() => {
        // Check if user is logged in (e.g., check localStorage or session)
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const storedSignupData = localStorage.getItem('signupData');

        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }

        if (storedSignupData) {
            setSignupData(JSON.parse(storedSignupData));
        }

        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('signupData');
        setIsAuthenticated(false);
        setUser(null);
        setSignupData(null);
    };

    const updateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const storeSignupData = (data) => {
        localStorage.setItem('signupData', JSON.stringify(data));
        setSignupData(data);
    };

    const clearSignupData = () => {
        localStorage.removeItem('signupData');
        setSignupData(null);
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        signupData,
        login,
        logout,
        updateUser,
        storeSignupData,
        clearSignupData
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

export default AuthContext; 