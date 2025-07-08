import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RegisterEmail = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = t('auth.enterValidEmail');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('auth.enterValidEmail');
        }

        if (!formData.password) {
            newErrors.password = t('auth.passwordRequired');
        } else if (formData.password.length < 6) {
            newErrors.password = t('auth.passwordMinLength');
        }

        if (!formData.firstName) {
            newErrors.firstName = t('auth.firstNameRequired');
        }

        if (!formData.lastName) {
            newErrors.lastName = t('auth.lastNameRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('auth.signUpWithEmail')}
                    </h1>
                    <p className="text-gray-600">
                        {t('auth.createStage222Account')}
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('forms.email')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder={t('auth.enterEmailPlaceholder')}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('forms.password')}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder={t('auth.enterPasswordPlaceholder')}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('forms.firstName')}
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder={t('auth.firstNamePlaceholder')}
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('forms.lastName')}
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00A55F] focus:border-[#00A55F] outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder={t('auth.lastNamePlaceholder')}
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#00A55F] text-white px-4 py-3 rounded-lg hover:bg-[#008c4f] transition-colors font-medium"
                    >
                        {t('auth.register')}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-sm text-gray-600">
                        {t('auth.bySigningUp')}{' '}
                        <Link to="/terms" className="text-[#00A55F] hover:text-[#008c4f]">
                            {t('auth.termsAndConditions')}
                        </Link>
                    </p>
                    <p className="text-sm text-gray-600">
                        {t('auth.alreadyRegistered')}{' '}
                        <Link to="/login" className="text-[#00A55F] hover:text-[#008c4f]">
                            {t('auth.login')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterEmail; 