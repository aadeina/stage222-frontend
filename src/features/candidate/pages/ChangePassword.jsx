// ChangePassword.jsx
// World-class, professional change password page for Stage222
// Uses mock logic for now; ready for API integration

import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

const ChangePassword = () => {
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!current || !next || !confirm) {
            setError('All fields are required.');
            return;
        }
        if (next !== confirm) {
            setError('New passwords do not match.');
            return;
        }
        if (next.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess('Password changed successfully!');
            setCurrent('');
            setNext('');
            setConfirm('');
        }, 1200);
    };

    return (
        <div className="max-w-md mx-auto py-12 px-2 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">Change Password</h1>
            <form onSubmit={handleSubmit} className="bg-white border rounded-xl shadow p-6 space-y-6">
                {/* Current Password */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            value={current}
                            onChange={e => setCurrent(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A55F] pr-10"
                            placeholder="Enter your current password"
                            autoComplete="current-password"
                        />
                        <button type="button" className="absolute right-2 top-2 text-gray-400 hover:text-[#00A55F]" onClick={() => setShowCurrent(v => !v)}>
                            {showCurrent ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                {/* New Password */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                        <input
                            type={showNext ? 'text' : 'password'}
                            value={next}
                            onChange={e => setNext(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A55F] pr-10"
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                        />
                        <button type="button" className="absolute right-2 top-2 text-gray-400 hover:text-[#00A55F]" onClick={() => setShowNext(v => !v)}>
                            {showNext ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                {/* Confirm New Password */}
                <div>
                    <label className="block font-semibold text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A55F] pr-10"
                            placeholder="Re-enter your new password"
                            autoComplete="new-password"
                        />
                        <button type="button" className="absolute right-2 top-2 text-gray-400 hover:text-[#00A55F]" onClick={() => setShowConfirm(v => !v)}>
                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                {/* Error/Success Feedback */}
                {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                {success && <div className="text-green-600 text-sm text-center">{success}</div>}
                {/* Save Button */}
                <button type="submit" disabled={loading} className="w-full bg-[#00A55F] hover:bg-[#008c4f] text-white font-semibold py-2 rounded-lg shadow transition flex items-center justify-center gap-2 disabled:opacity-60">
                    <FaLock /> {loading ? 'Saving...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword; 