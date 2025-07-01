import React from 'react';

const renderNestedStats = (key, value) => {
    if (typeof value !== 'object' || value === null) return null;
    // Special handling for by_role or similar
    if (value.by_role) {
        return (
            <div className="mt-2">
                <div className="text-xs font-semibold text-gray-500 mb-1">By Role</div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(value.by_role).map(([role, count]) => (
                        <span key={role} className="inline-block bg-gray-100 text-gray-700 rounded px-2 py-1 text-xs">
                            {role.charAt(0).toUpperCase() + role.slice(1)}: <span className="font-bold">{count}</span>
                        </span>
                    ))}
                </div>
            </div>
        );
    }
    // Generic: show all keys/values except nested objects
    return (
        <div className="mt-2 space-y-1">
            {Object.entries(value).map(([k, v]) => {
                if (typeof v === 'object' && v !== null) return null;
                return (
                    <div key={k} className="text-xs text-gray-600">
                        {k.charAt(0).toUpperCase() + k.slice(1)}: <span className="font-bold">{v}</span>
                    </div>
                );
            })}
        </div>
    );
};

/**
 * AnalyticsCards - displays platform stats in a responsive card grid
 * @param {Object} stats - key/value pairs for each stat
 */
const statMeta = {
    users: { label: 'Total Users', color: 'bg-blue-100 text-blue-800', icon: '👥' },
    recruiters: { label: 'Recruiters', color: 'bg-green-100 text-green-800', icon: '🧑‍💼' },
    candidates: { label: 'Candidates', color: 'bg-yellow-100 text-yellow-800', icon: '🎓' },
    internships: { label: 'Internships', color: 'bg-purple-100 text-purple-800', icon: '💼' },
    jobs: { label: 'Jobs', color: 'bg-pink-100 text-pink-800', icon: '🧑‍💻' },
    organizations: { label: 'Organizations', color: 'bg-indigo-100 text-indigo-800', icon: '🏢' },
    applications: { label: 'Applications', color: 'bg-orange-100 text-orange-800', icon: '📄' },
    growth: { label: 'Growth', color: 'bg-teal-100 text-teal-800', icon: '📈' },
};

const AnalyticsCards = ({ stats = {} }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, value]) => {
            const meta = statMeta[key] || { label: key, color: 'bg-gray-100 text-gray-800', icon: '📊' };
            const isObject = typeof value === 'object' && value !== null;
            return (
                <div key={key} className={`rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col ${meta.color}`}>
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl">{meta.icon}</span>
                        <div>
                            <div className="text-lg font-bold">{meta.label}</div>
                        </div>
                    </div>
                    {/* If value is a number or string, show as before */}
                    {!isObject && (
                        <div className="text-2xl font-bold mb-2">{value}</div>
                    )}
                    {/* If value is an object, show nested stats */}
                    {isObject && (
                        <>
                            {/* Show top-level keys like total, verified, unverified, etc. */}
                            {renderNestedStats(key, value)}
                        </>
                    )}
                </div>
            );
        })}
    </div>
);

export default AnalyticsCards; 