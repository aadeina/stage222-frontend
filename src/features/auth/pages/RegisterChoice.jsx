import { Link } from 'react-router-dom';

const RegisterChoice = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
                    <p className="text-gray-600">Choose how you want to sign up</p>
                </div>



                {/* Email Sign Up Button */}
                <Link
                    to="/register/email"
                    className="w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium text-center block mb-6"
                >
                    Sign up with Email
                </Link>

                {/* Terms and Login Links */}
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                        By signing up, you agree to our{' '}
                        <Link to="/terms" className="text-[#00A55F] hover:text-[#008c4f]">
                            Terms and Conditions
                        </Link>
                    </p>
                    <p className="text-sm text-gray-600">
                        Already registered?{' '}
                        <Link to="/login" className="text-[#00A55F] hover:text-[#008c4f] font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterChoice; 