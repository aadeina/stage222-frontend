import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const LanguageSelector = () => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    // Get current language
    const currentLanguage = i18n.language;

    // Handle language change
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.language-selector')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="language-selector relative">
            {/* Language Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#00A55F] transition-colors rounded-md hover:bg-gray-50"
                aria-label={t('language.selectLanguage')}
            >
                {/* Current Language Flag */}
                <span className="text-lg">
                    {currentLanguage === 'en' ? '🇬🇧' : '🇫🇷'}
                </span>
                <span className="hidden sm:inline">
                    {currentLanguage === 'en' ? 'EN' : 'FR'}
                </span>
                {/* Dropdown Arrow */}
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Language Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                        {/* English Option */}
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentLanguage === 'en' ? 'text-[#00A55F] bg-[#00A55F]/5' : 'text-gray-700'
                                }`}
                        >
                            <span className="text-lg mr-3">🇬🇧</span>
                            <span>{t('language.english')}</span>
                            {currentLanguage === 'en' && (
                                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* French Option */}
                        <button
                            onClick={() => changeLanguage('fr')}
                            className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentLanguage === 'fr' ? 'text-[#00A55F] bg-[#00A55F]/5' : 'text-gray-700'
                                }`}
                        >
                            <span className="text-lg mr-3">🇫🇷</span>
                            <span>{t('language.french')}</span>
                            {currentLanguage === 'fr' && (
                                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector; 