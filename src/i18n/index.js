import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './en.json';
import frTranslations from './fr.json';

// Configure i18next
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // Default language (French)
        lng: 'fr',

        // Fallback language
        fallbackLng: 'fr',

        // Debug mode (set to false in production)
        debug: false,

        // Resources with translations
        resources: {
            en: {
                translation: enTranslations
            },
            fr: {
                translation: frTranslations
            }
        },

        // Detection options
        detection: {
            // Order of language detection methods
            order: ['localStorage', 'navigator', 'htmlTag'],

            // Keys to store language preference
            lookupLocalStorage: 'i18nextLng',

            // Cache user language preference
            caches: ['localStorage'],

            // Don't cache language preference in sessionStorage
            excludeCacheFor: ['cimode']
        },

        // Interpolation options
        interpolation: {
            escapeValue: false // React already escapes values
        },

        // React options
        react: {
            useSuspense: false
        }
    });

export default i18n; 