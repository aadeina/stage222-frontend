import React, { useEffect, useState } from 'react';
import { fetchAdminUsers } from '../../../services/adminApi';
import UserTable from '../components/UserTable';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';
import AdminProfileDropdown from '../components/AdminProfileDropdown';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Add cache-busting parameter to ensure fresh data
            const timestamp = new Date().getTime();
            const res = await fetchAdminUsers();
            console.log('Full user data from API:', res.data); // Debug log
            const userData = res.data.results || res.data;
            console.log('Processed user data:', userData); // Debug log

            // Debug: Check what fields are available in the first user
            if (userData.length > 0) {
                console.log('Available fields in first user:', Object.keys(userData[0]));
                console.log('First user data:', userData[0]);

                // Check for specific user by email to debug name updates
                const testUser = userData.find(user => user.email === 'aadeina1@gmail.com');
                if (testUser) {
                    console.log('Test user (aadeina1@gmail.com) data:', {
                        id: testUser.id,
                        first_name: testUser.first_name,
                        last_name: testUser.last_name,
                        name: testUser.name,
                        full_name: testUser.full_name,
                        display_name: testUser.display_name,
                        username: testUser.username,
                        updated_at: testUser.updated_at,
                        created_at: testUser.created_at
                    });

                    // Compare with expected data from candidate portal
                    console.log('Expected data from candidate portal:', {
                        first_name: 'Seyid',
                        last_name: 'Amar',
                        full_name: 'Seyid Amar'
                    });

                    console.log('Data mismatch detected:', {
                        admin_first_name: testUser.first_name,
                        expected_first_name: 'Seyid',
                        admin_last_name: testUser.last_name,
                        expected_last_name: 'Amar'
                    });
                }
            }

            setUsers(userData);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users.');
            toast.error('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();

        // Auto-refresh every 30 seconds to ensure data is up to date
        const interval = setInterval(() => {
            console.log('Auto-refreshing users data...');
            getUsers();
        }, 30000); // 30 seconds

        // Refresh when page becomes visible again
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log('Page became visible, refreshing users data...');
                getUsers();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                                <p className="text-gray-600 mt-1">View, verify, and manage all users on Stage222</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        console.log('Manual refresh triggered');
                                        getUsers();
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh Users
                                </button>
                                <AdminProfileDropdown />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    {loading && (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A55F]"></div>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-600 font-medium mb-4">{error}</div>
                    )}
                    {!loading && !error && <UserTable users={users} onActionComplete={getUsers} />}
                </main>
            </div>
        </div>
    );
};

export default UserManagement; 