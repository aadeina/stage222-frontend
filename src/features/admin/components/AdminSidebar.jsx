import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'User Management', path: '/admin/users', icon: '👥' },
    { name: 'Internship Moderation', path: '/admin/internships', icon: '📝' },
];

const AdminSidebar = () => (
    <aside className="bg-white border-r border-gray-200 min-h-screen w-64 flex flex-col py-8 px-4">
        <div className="mb-8 text-2xl font-bold text-blue-700 flex items-center gap-2">
            <span>🌐</span>
            <span>Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-lg ${isActive
                            ? 'bg-blue-100 text-blue-700 shadow'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                        }`
                    }
                >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                </NavLink>
            ))}
        </nav>
    </aside>
);

export default AdminSidebar; 