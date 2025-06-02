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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Create Account</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="recruiter">Recruiter</option>
          <option value="candidate">Candidate</option>
        </select>
        <input type="email" className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="input" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-[#00A55F] text-white w-full py-2 rounded">Register</button>
      </form>
    </div>
  );
}
