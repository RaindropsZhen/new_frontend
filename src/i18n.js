import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi) // Use HttpApi to load translations from a backend
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    supportedLngs: ['en', 'zh', 'es', 'pt'], // Supported languages
    fallbackLng: "en", // Fallback language if detected language is not available
    defaultNS: 'translation', // Default namespace for translations
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
  });

export default i18n;