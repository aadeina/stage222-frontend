import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                {/* Topbar (optional) */}
                <header className="h-16 flex items-center justify-end px-6 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700">Admin</span>
                        <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold text-sm">Logout</button>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout; 