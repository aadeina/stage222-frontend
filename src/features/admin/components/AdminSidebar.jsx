import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaChartBar, FaUserShield, FaClipboardCheck, FaBuilding } from 'react-icons/fa';
import Stage222Logo from '@/assets/images/MainStage222Logo.png';

const AdminSidebar = () => {
    const { t } = useTranslation();

    // Navigation items for the admin sidebar with professional icons
    const navItems = [
        { name: t('admin.navigation.dashboard'), path: '/admin/dashboard', icon: <FaChartBar className="text-2xl" /> },
        { name: t('admin.navigation.userManagement'), path: '/admin/users', icon: <FaUserShield className="text-2xl" /> },
        { name: t('admin.navigation.internshipModeration'), path: '/admin/internships', icon: <FaClipboardCheck className="text-2xl" /> },
        { name: t('admin.navigation.organizationModeration'), path: '/admin/organizations', icon: <FaBuilding className="text-2xl" /> },
    ];

    // World-class AdminSidebar with glassmorphism and premium design
    return (
        <aside
            className="hidden lg:flex backdrop-blur-lg bg-gradient-to-b from-[#00A55F]/90 via-[#008c4f]/80 to-[#005c2e]/90 min-h-screen w-72 flex-col py-6 sm:py-10 px-4 sm:px-6 sticky top-0 shadow-2xl z-30 border-r border-white/10 rounded-tr-3xl rounded-br-3xl"
            style={{ boxShadow: '0 8px 32px 0 rgba(0, 165, 95, 0.25)' }}
        >
            {/* Logo and Brand */}
            <div className="mb-8 sm:mb-12 flex items-center gap-3 sm:gap-4 px-2">
                <img src={Stage222Logo} alt="Stage222 Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white p-2 shadow-lg" />
                <span className="text-xl sm:text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">{t('admin.components.sidebar.stage222Admin')}</span>
            </div>
            {/* Navigation */}
            <nav className="flex-1 space-y-2 sm:space-y-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl font-semibold transition-all text-base sm:text-lg group shadow-sm ${isActive
                                ? 'bg-white/90 text-[#00A55F] shadow-lg scale-105'
                                : 'text-white/90 hover:bg-white/10 hover:text-white/100 hover:scale-105'
                            }`
                        }
                    >
                        <span className="transition-all group-hover:scale-110 text-xl sm:text-2xl">{item.icon}</span>
                        <span className="tracking-wide">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
            {/* Footer */}
            <div className="mt-auto pt-6 sm:pt-10 text-xs text-white/60 px-2 text-center select-none">
                {t('admin.components.sidebar.copyright')}
            </div>
        </aside>
    );
};

export default AdminSidebar; 