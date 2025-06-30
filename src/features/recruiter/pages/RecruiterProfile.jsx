import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { FaArrowLeft, FaUpload, FaCheckCircle } from 'react-icons/fa';

const designations = [
    "Hiring Manager",
    "Recruiter",
    "Talent Acquisition Specialist",
    "HR Manager",
    "Founder",
    "Co-Founder",
    "CEO",
    "CTO",
    "COO",
    "Managing Director",
    "Technical Recruiter",
    "HR Executive",
    "Operations Manager",
    "Administrative Officer",
    "Marketing Manager",
    "Team Lead",
    "Engineering Manager",
    "Product Manager"
];

export default function RecruiterProfile() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        designation: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch recruiter info
                const res = await api.get('/recruiters/me/');
                const recruiter = res.data.data || res.data;

                console.log('Recruiter data from API:', recruiter);
                console.log('Authenticated user:', user);

                setForm({
                    firstName: recruiter.first_name || user?.first_name || '',
                    lastName: recruiter.last_name || user?.last_name || '',
                    email: recruiter.email || user?.email || '',
                    phone: recruiter.phone || user?.phone || '',
                    designation: recruiter.designation || '',
                });
            } catch (err) {
                console.error('Error fetching recruiter data:', err);
                // Fallback to authenticated user data
                setForm({
                    firstName: user?.first_name || '',
                    lastName: user?.last_name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    designation: user?.designation || '',
                });
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
        setErrors(e => ({ ...e, [name]: undefined }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.firstName) newErrors.firstName = 'First name required';
        if (!form.lastName) newErrors.lastName = 'Last name required';
        if (!form.designation) newErrors.designation = 'Designation required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        try {
            // Update recruiter profile (only editable fields)
            await api.put('/recruiters/me/', {
                first_name: form.firstName,
                last_name: form.lastName,
                designation: form.designation,
            });

            // Update the user context with new data
            const updatedUser = {
                ...user,
                first_name: form.firstName,
                last_name: form.lastName,
                designation: form.designation,
            };
            updateUser(updatedUser);

            toast.success('Profile updated!');
            navigate('/recruiter/dashboard');
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back to Dashboard */}
                <button
                    onClick={() => navigate('/recruiter/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                    <FaArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </button>
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">First Name</label>
                                <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent bg-white" />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Last Name</label>
                                <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent bg-white" />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Email</label>
                                <input name="email" value={form.email} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-100 text-gray-600 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Phone</label>
                                <input name="phone" value={form.phone} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-100 text-gray-600 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Designation</label>
                                <select name="designation" value={form.designation} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00A55F] focus:border-transparent bg-white">
                                    <option value="">Select designation</option>
                                    {designations.map(designation => (
                                        <option key={designation} value={designation}>{designation}</option>
                                    ))}
                                </select>
                                {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button type="button" onClick={() => navigate('/recruiter/dashboard')} className="px-6 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-semibold hover:bg-gray-100 transition-all">Cancel</button>
                            <button type="submit" disabled={saving} className="px-8 py-2 rounded-lg bg-gradient-to-r from-[#00A55F] to-[#008c4f] text-white font-bold shadow-md hover:from-[#008c4f] hover:to-[#00A55F] transition-all">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 