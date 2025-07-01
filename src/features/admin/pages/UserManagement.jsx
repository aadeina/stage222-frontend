import React, { useEffect, useState } from 'react';
import { fetchAdminUsers } from '../../../services/adminApi';
import AdminLayout from '../components/AdminLayout';
import UserTable from '../components/UserTable';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchAdminUsers();
            setUsers(res.data.results || res.data);
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
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            {loading && (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
            )}
            {error && (
                <div className="text-red-600 font-medium mb-4">{error}</div>
            )}
            {!loading && !error && <UserTable users={users} onActionComplete={getUsers} />}
        </AdminLayout>
    );
};

export default UserManagement; 