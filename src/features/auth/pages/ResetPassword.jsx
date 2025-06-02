import { useState } from 'react';
import { requestPasswordReset } from '../api/authApi';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [email, setEmail] = useState('');

  const handleRequest = async () => {
    try {
      await requestPasswordReset(email);
      toast.success('Reset email sent!');
    } catch {
      toast.error('Error sending reset');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded shadow text-center">
      <h2 className="text-lg font-semibold mb-4">Reset Your Password</h2>
      <input className="input mb-4" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
      <button className="bg-[#00A55F] text-white w-full py-2 rounded" onClick={handleRequest}>Send Reset Link</button>
    </div>
  );
}
