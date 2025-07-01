import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { toggleVerifyUser, toggleActiveUser, deleteUser, changeUserRole } from '../../../services/adminApi';

const UserTable = ({ users = [], onActionComplete }) => {
    const [loadingId, setLoadingId] = useState(null);

    const handleVerify = async (id) => {
        setLoadingId(id);
        try {
            await toggleVerifyUser(id);
            toast.success('User verification status updated!');
            onActionComplete && onActionComplete();
        } catch {
            toast.error('Failed to update verification.');
        } finally {
            setLoadingId(null);
        }
    };

    const handleActivate = async (id) => {
        setLoadingId(id);
        try {
            await toggleActiveUser(id);
            toast.success('User active status updated!');
            onActionComplete && onActionComplete();
        } catch {
            toast.error('Failed to update active status.');
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        setLoadingId(id);
        try {
            await deleteUser(id);
            toast.success('User deleted!');
            onActionComplete && onActionComplete();
        } catch {
            toast.error('Failed to delete user.');
        } finally {
            setLoadingId(null);
        }
    };

    const handleChangeRole = async (id) => {
        const newRole = window.prompt('Enter new role (admin, recruiter, student):');
        if (!newRole) return;
        setLoadingId(id);
        try {
            await changeUserRole(id, { role: newRole });
            toast.success('User role updated!');
            onActionComplete && onActionComplete();
        } catch {
            toast.error('Failed to change role.');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Verified</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Active</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-blue-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name || user.full_name || user.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.role}</td>
                            <td className="px-6 py-4 text-center">
                                {user.is_verified ? <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Yes</span> : <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">No</span>}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {user.is_active ? <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span> : <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Inactive</span>}
                            </td>
                            <td className="px-6 py-4 text-center space-x-2">
                                <button onClick={() => handleVerify(user.id)} disabled={loadingId === user.id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold disabled:opacity-50">Verify</button>
                                <button onClick={() => handleActivate(user.id)} disabled={loadingId === user.id} className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-semibold disabled:opacity-50">Activate</button>
                                <button onClick={() => handleChangeRole(user.id)} disabled={loadingId === user.id} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs font-semibold disabled:opacity-50">Role</button>
                                <button onClick={() => handleDelete(user.id)} disabled={loadingId === user.id} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-semibold disabled:opacity-50">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {users.length === 0 && (
                <div className="p-8 text-center text-gray-500">No users found.</div>
            )}
        </div>
    );
};

export default UserTable; 