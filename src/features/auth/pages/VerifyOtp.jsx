import { useState } from 'react';
import { verifyOtp } from '../api/authApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await verifyOtp({ otp });
      toast.success('Account verified!');
      navigate('/login');
    } catch {
      toast.error('Invalid OTP');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded text-center">
      <h2 className="text-lg font-semibold mb-4">Enter OTP</h2>
      <input className="input mb-4" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button className="bg-[#00A55F] text-white w-full py-2 rounded" onClick={handleVerify}>Verify</button>
    </div>
  );
}
