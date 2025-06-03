import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.first_name || 'user'}!`);
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success("Logged out successfully.");
  };

  // Optional: Refresh user from API (if you have `/auth/profile/`)
  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/profile/', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isRecruiter: user?.role === 'recruiter',
    isCandidate: user?.role === 'candidate',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
