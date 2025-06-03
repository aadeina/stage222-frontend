import RegisterForm from '../components/RegisterForm';

const RegisterStudent = () => {
    const studentFeatures = [
        'Access to 1000+ internships and jobs',
        'Connect with top employers',
        'Build your professional profile'
    ];

    return (
        <RegisterForm
            role="candidate"
            title="Join Stage222 as a Student"
            description="Create your account to access internships and job opportunities in Mauritania. Connect with employers and start your career journey."
            features={studentFeatures}
        />
    );
};

export default RegisterStudent; 