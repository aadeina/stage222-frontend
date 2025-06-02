import { Link } from 'react-router-dom';

const RegisterStudent = () => {
    const handleGoogleSignup = () => {
        console.log('Google signup clicked');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Sign-up and apply for free
                    </h1>
                    <p className="text-gray-600">
                        3,00,000+ companies hiring on Stage222
                    </p>
                </div>

                {/* Google Sign Up Button */}
                <button
                    onClick={handleGoogleSignup}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors mb-6"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Sign up with Google
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Email Sign Up Link */}
                <Link
                    to="/register/email"
                    className="block w-full text-center bg-[#00A55F] text-white px-4 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium"
                >
                    Sign up with Email
                </Link>

                {/* Footer */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-sm text-gray-600">
                        By signing up, you agree to our{' '}
                        <Link to="/terms" className="text-[#00A55F] hover:text-[#008c4f]">
                            Terms and Conditions
                        </Link>
                    </p>
                    <p className="text-sm text-gray-600">
                        Already registered?{' '}
                        <Link to="/login" className="text-[#00A55F] hover:text-[#008c4f]">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterStudent; 