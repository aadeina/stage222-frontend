import React from 'react';
import GrowthChart from './analytics/GrowthChart';
import EngagementChart from './analytics/EngagementChart';
import ConversionChart from './analytics/ConversionChart';
import TopUsersChart from './analytics/TopUsersChart';

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

// Professional analytics cards layout
const AnalyticsCards = ({ growthData, engagementData, conversionData, topUsersData, avgDaysToFirstPost, loading }) => {
    return (
        <section className="max-w-7xl mx-auto w-full mt-8">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-2">
                <span className="inline-block w-2 h-8 bg-[#00A55F] rounded-lg"></span>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Analytics</h2>
                <span className="text-[#00A55F] text-2xl">📊</span>
            </div>
            <p className="text-gray-500 mb-8">Key metrics and trends for Stage222 platform performance.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {/* Growth Trends Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 group relative">
                        <span className="text-[#00A55F] text-xl cursor-pointer" tabIndex={0} aria-label="Growth Trends Info">📈</span>
                        <span className="font-bold text-lg text-gray-900">Growth Trends</span>
                        {/* Tooltip */}
                        <div className="absolute left-8 top-0 z-10 hidden group-hover:block group-focus:block bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg w-56">
                            Shows user and recruiter growth over time.
                        </div>
                    </div>
                    <div className="border-b border-gray-100 mb-4"></div>
                    <GrowthChart data={growthData} loading={loading} />
                </div>
                {/* Engagement Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 group relative">
                        <span className="text-[#00A55F] text-xl cursor-pointer" tabIndex={0} aria-label="Engagement Info">💬</span>
                        <span className="font-bold text-lg text-gray-900">Engagement</span>
                        {/* Tooltip */}
                        <div className="absolute left-8 top-0 z-10 hidden group-hover:block group-focus:block bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg w-56">
                            Tracks user activity and engagement metrics.
                        </div>
                    </div>
                    <div className="border-b border-gray-100 mb-4"></div>
                    <EngagementChart data={engagementData} loading={loading} />
                </div>
                {/* Conversions Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 group relative">
                        <span className="text-[#00A55F] text-xl cursor-pointer" tabIndex={0} aria-label="Conversions Info">🔄</span>
                        <span className="font-bold text-lg text-gray-900">Conversions</span>
                        {/* Tooltip */}
                        <div className="absolute left-8 top-0 z-10 hidden group-hover:block group-focus:block bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg w-56">
                            Displays conversion rates for key platform actions.
                        </div>
                    </div>
                    <div className="border-b border-gray-100 mb-4"></div>
                    <ConversionChart data={conversionData} loading={loading} />
                    {/* Highlight Avg Days to First Post */}
                    <div className="mt-4 flex items-center gap-2 group relative">
                        <span className="text-gray-500 text-sm cursor-pointer" tabIndex={0} aria-label="Avg Days to First Post Info">Avg Days to First Post:</span>
                        <span className="bg-[#E6FAF1] text-[#00A55F] font-bold px-3 py-1 rounded-lg text-lg shadow">
                            {avgDaysToFirstPost}
                        </span>
                        {/* Tooltip */}
                        <div className="absolute left-0 top-8 z-10 hidden group-hover:block group-focus:block bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg w-56">
                            Average days from signup to first internship post.
                        </div>
                    </div>
                </div>
                {/* Top Users Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 group relative">
                        <span className="text-[#00A55F] text-xl cursor-pointer" tabIndex={0} aria-label="Top Users Info">🏆</span>
                        <span className="font-bold text-lg text-gray-900">Top Users</span>
                        {/* Tooltip */}
                        <div className="absolute left-8 top-0 z-10 hidden group-hover:block group-focus:block bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg w-56">
                            Highlights the most active users and recruiters.
                        </div>
                    </div>
                    <div className="border-b border-gray-100 mb-4"></div>
                    <TopUsersChart data={topUsersData} loading={loading} />
                </div>
            </div>
        </section>
    );
};

export default AnalyticsCards; 