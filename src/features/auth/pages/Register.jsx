import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../api/authApi';

export default function Register() {
    const [form, setForm] = useState({ email: '', password: '', role: 'recruiter' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            toast.success('OTP sent');
            navigate('/verify-otp');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Create Account</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Account Type
                        </label>
                        <select
                            id="role"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                            <option value="recruiter">Recruiter</option>
                            <option value="candidate">Candidate</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                    <button className="w-full bg-[#00A55F] text-white py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
