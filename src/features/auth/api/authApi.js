import axios from "@/api/axios"; // make sure axios is configured properly

// Register user
export const register = async (formData) => {
  const response = await axios.post("/auth/register/", formData);
  return response.data;
};

// Login user
export const login = async (formData) => {
  const response = await axios.post("/auth/login/", formData);
  return response.data;
};

// Verify OTP
export const verifyOtp = async ({ email, otp }) => {
  const response = await axios.post("/auth/verify-email/", { email, otp });
  return response.data;
};

// Resend OTP
export const resendOtp = async ({ email }) => {
  const response = await axios.post("/auth/resend-email-verification/", { email });
  return response.data;
};

// Request Password Reset (send OTP)
export const requestResetPassword = async ({ email }) => {
  const response = await axios.post("/auth/password-reset-request/", { email });
  return response.data;
};

// Verify Reset OTP & Set New Password
export const resetPassword = async (data) => {
  const response = await axios.post("/auth/password-reset/", data);
  return response.data;
};
