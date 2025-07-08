import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { toggleVerifyUser, toggleActiveUser, deleteUser, changeUserRole } from '../../../services/adminApi';

const UserTable = ({ users = [], onActionComplete }) => {
    const { t } = useTranslation();
    const [loadingId, setLoadingId] = useState(null);

    // Debug: Log user data to see available fields
    console.log('UserTable users data:', users);

    const handleVerify = async (id) => {
        setLoadingId(id);
        try {
            await toggleVerifyUser(id);
            toast.success(t('admin.components.userTable.userVerificationUpdated'));
            onActionComplete && onActionComplete();
        } catch {
            toast.error(t('admin.components.userTable.failedToUpdateVerification'));
        } finally {
            setLoadingId(null);
        }
    };

    const handleActivate = async (id) => {
        setLoadingId(id);
        try {
            await toggleActiveUser(id);
            toast.success(t('admin.components.userTable.userActiveStatusUpdated'));
            onActionComplete && onActionComplete();
        } catch {
            toast.error(t('admin.components.userTable.failedToUpdateActiveStatus'));
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.components.userTable.confirmDeleteUser'))) return;
        setLoadingId(id);
        try {
            await deleteUser(id);
            toast.success(t('admin.components.userTable.userDeleted'));
            onActionComplete && onActionComplete();
        } catch {
            toast.error(t('admin.components.userTable.failedToDeleteUser'));
        } finally {
            setLoadingId(null);
        }
    };

    const handleChangeRole = async (id) => {
        const newRole = window.prompt(t('admin.components.userTable.enterNewRole'));
        if (!newRole) return;
        setLoadingId(id);
        try {
            await changeUserRole(id, { role: newRole });
            toast.success(t('admin.components.userTable.userRoleUpdated'));
            onActionComplete && onActionComplete();
        } catch {
            toast.error(t('admin.components.userTable.failedToChangeRole'));
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{t('admin.components.userTable.name')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{t('admin.components.userTable.email')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{t('admin.components.userTable.role')}</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">{t('admin.components.userTable.verified')}</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">{t('admin.components.userTable.active')}</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">{t('admin.components.userTable.actions')}</th>
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
                                            return t('admin.components.userTable.noName');
                                        })()}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {user.email}
                                        {!user.first_name && !user.last_name && !user.name && !user.full_name && !user.display_name && (
                                            <span className="ml-1 text-orange-600">{t('admin.components.userTable.usingEmailAsName')}</span>
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
                                {user.is_verified ? <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{t('admin.components.userTable.yes')}</span> : <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">{t('admin.components.userTable.no')}</span>}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {user.is_active ? <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{t('admin.components.userTable.active')}</span> : <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">{t('admin.components.userTable.inactive')}</span>}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <button
                                        onClick={() => handleVerify(user.id)}
                                        disabled={loadingId === user.id}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold disabled:opacity-50 transition-colors"
                                        title="Toggle verification"
                                    >
                                        {user.is_verified ? t('admin.components.userTable.unverify') : t('admin.components.userTable.verify')}
                                    </button>
                                    <button
                                        onClick={() => handleActivate(user.id)}
                                        disabled={loadingId === user.id}
                                        className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-semibold disabled:opacity-50 transition-colors"
                                        title="Toggle active status"
                                    >
                                        {user.is_active ? t('admin.components.userTable.deactivate') : t('admin.components.userTable.activate')}
                                    </button>
                                    <button
                                        onClick={() => handleChangeRole(user.id)}
                                        disabled={loadingId === user.id}
                                        className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs font-semibold disabled:opacity-50 transition-colors"
                                        title="Change user role"
                                    >
                                        {t('admin.components.userTable.role')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        disabled={loadingId === user.id}
                                        className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-semibold disabled:opacity-50 transition-colors"
                                        title="Delete user"
                                    >
                                        {t('admin.components.userTable.delete')}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {users.length === 0 && (
                <div className="p-8 text-center text-gray-500">{t('admin.components.userTable.noUsersFound')}</div>
            )}
        </div>
    );
};

export default UserTable; 