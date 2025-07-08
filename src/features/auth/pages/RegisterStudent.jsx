import { useTranslation } from 'react-i18next';
import RegisterForm from '../components/RegisterForm';

const RegisterStudent = () => {
    const { t } = useTranslation();

    const studentFeatures = t('registration.studentFeatures', { returnObjects: true });

    return (
        <RegisterForm
            role="candidate"
            title={t('registration.joinAsStudent')}
            description={t('registration.studentDescription')}
            features={studentFeatures}
        />
    );
};

export default RegisterStudent; 