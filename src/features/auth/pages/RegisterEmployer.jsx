import { useTranslation } from 'react-i18next';
import RegisterForm from '../components/RegisterForm';

const RegisterEmployer = () => {
    const { t } = useTranslation();

    const employerFeatures = t('registration.employerFeatures', { returnObjects: true });

    return (
        <RegisterForm
            role="recruiter"
            title={t('registration.joinAsEmployer')}
            description={t('registration.employerDescription')}
            features={employerFeatures}
        />
    );
};

export default RegisterEmployer; 