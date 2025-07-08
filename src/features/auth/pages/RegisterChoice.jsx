import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RegisterChoice = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.createAccountTitle')}</h1>
                    <p className="text-gray-600">{t('auth.chooseSignUpMethod')}</p>
                </div>



                {/* Email Sign Up Button */}
                <Link
                    to="/register/email"
                    className="w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium text-center block mb-6"
                >
                    {t('auth.signUpWithEmail')}
                </Link>

                {/* Terms and Login Links */}
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                        {t('auth.bySigningUp')}{' '}
                        <Link to="/terms" className="text-[#00A55F] hover:text-[#008c4f]">
                            {t('auth.termsAndConditions')}
                        </Link>
                    </p>
                    <p className="text-sm text-gray-600">
                        {t('auth.alreadyRegistered')}{' '}
                        <Link to="/login" className="text-[#00A55F] hover:text-[#008c4f] font-medium">
                            {t('auth.login')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterChoice; 