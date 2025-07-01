import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { toggleVerifyUser, toggleActiveUser, deleteUser, changeUserRole } from '../../../services/adminApi';

const UserTable = ({ users = [], onActionComplete }) => {
    const [loadingId, setLoadingId] = useState(null);

    // Debug: Log user data to see available fields
    console.log('UserTable users data:', users);

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
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Verified</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Active</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-blue-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">
                                        {(() => {
                                            // Try multiple possible name field combinations
                                            if (user.first_name && user.last_name) {
                                                return `${user.first_name} ${user.last_name}`;
                                            }
                                            if (user.first_name) return user.first_name;
                                            if (user.last_name) return user.last_name;
                                            if (user.name) return user.name;
                                            if (user.full_name) return user.full_name;
                                            if (user.display_name) return user.display_name;
                                            if (user.username) return user.username;
                                            if (user.email) return user.email.split('@')[0];
                                            return 'No Name';
                                        })()}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {user.email}
                                        {!user.first_name && !user.last_name && !user.name && !user.full_name && !user.display_name && (
                                            <span className="ml-1 text-orange-600">(Using email as name)</span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                    user.role === 'recruiter' ? 'bg-blue-100 text-blue-800' :
                                        user.role === 'student' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                {user.is_verified ? <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Yes</span> : <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">No</span>}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {user.is_active ? <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span> : <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Inactive</span>}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <button
                                        onClick={() => handleVerify(user.id)}
                                        disabled={loadingId === user.id}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold disabled:opacity-50 transition-colors"
                                        title="Toggle verification"
                                    >
                                        {user.is_verified ? 'Unverify' : 'Verify'}
                                    </button>
                                    <button
                                        onClick={() => handleActivate(user.id)}
                                        disabled={loadingId === user.id}
                                        className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-semibold disabled:opacity-50 transition-colors"
                                        title="Toggle active status"
                                    >
                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleChangeRole(user.id)}
                                        disabled={loadingId === user.id}
                                        className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs font-semibold disabled:opacity-50 transition-colors"
                                        title="Change user role"
                                    >
                                        Role
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        disabled={loadingId === user.id}
                                        className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-semibold disabled:opacity-50 transition-colors"
                                        title="Delete user"
                                    >
                                        Delete
                                    </button>
                                </div>
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