import { useTranslation } from 'react-i18next';
import RegisterForm from '../components/RegisterForm';

const RegisterStudent = () => {
    const { t } = useTranslation();

    const studentFeatures = t('registration.studentFeatures', { returnObjects: true }) || [
        "Accès à des milliers d'opportunités de stage",
        "Profil professionnel personnalisé",
        "Notifications en temps réel",
        "Support dédié aux étudiants"
    ];

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