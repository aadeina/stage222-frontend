import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaUserShield, FaClipboardCheck, FaBuilding } from 'react-icons/fa';
import Stage222Logo from '@/assets/images/Stage222RecuiterLogo.png';

// Navigation items for the admin sidebar with professional icons
const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaChartBar className="text-2xl" /> },
    { name: 'User Management', path: '/admin/users', icon: <FaUserShield className="text-2xl" /> },
    { name: 'Internship Moderation', path: '/admin/internships', icon: <FaClipboardCheck className="text-2xl" /> },
    { name: 'Organization Moderation', path: '/admin/organizations', icon: <FaBuilding className="text-2xl" /> },
];

// World-class AdminSidebar with glassmorphism and premium design
const AdminSidebar = () => (
    <aside
        className="backdrop-blur-lg bg-gradient-to-b from-[#00A55F]/90 via-[#008c4f]/80 to-[#005c2e]/90 min-h-screen w-72 flex flex-col py-10 px-6 sticky top-0 shadow-2xl z-30 border-r border-white/10 rounded-tr-3xl rounded-br-3xl"
        style={{ boxShadow: '0 8px 32px 0 rgba(0, 165, 95, 0.25)' }}
    >
        {/* Logo and Brand */}
        <div className="mb-12 flex items-center gap-4 px-2">
            <img src={Stage222Logo} alt="Stage222 Logo" className="h-12 w-12 rounded-full bg-white p-2 shadow-lg" />
            <span className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">Stage222 Admin</span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 space-y-3">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all text-lg group shadow-sm ${isActive
                            ? 'bg-white/90 text-[#00A55F] shadow-lg scale-105'
                            : 'text-white/90 hover:bg-white/10 hover:text-white/100 hover:scale-105'
                        }`
                    }
                >
                    <span className="transition-all group-hover:scale-110">{item.icon}</span>
                    <span className="tracking-wide">{item.name}</span>
                </NavLink>
            ))}
        </nav>
        {/* Footer */}
        <div className="mt-auto pt-10 text-xs text-white/60 px-2 text-center select-none">
            &copy; {new Date().getFullYear()} Stage222. All rights reserved.
        </div>
    </aside>
);

export default AdminSidebar; 