import React, { useEffect, useState } from 'react';
import { fetchAdminUsers } from '../../../services/adminApi';
import UserTable from '../components/UserTable';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchAdminUsers();
            console.log('Full user data from API:', res.data); // Debug log
            const userData = res.data.results || res.data;
            console.log('Processed user data:', userData); // Debug log

            // Debug: Check what fields are available in the first user
            if (userData.length > 0) {
                console.log('Available fields in first user:', Object.keys(userData[0]));
                console.log('First user data:', userData[0]);
            }

            setUsers(userData);
        } catch (err) {
            setError('Failed to load users.');
            toast.error('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
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
                            <button
                                onClick={getUsers}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Refresh Users
                            </button>
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