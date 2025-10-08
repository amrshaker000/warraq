import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import arTranslations from "./locales/ar.json";
import enTranslations from "./locales/en.json";

const resources = {
  ar: { translation: arTranslations },
  en: { translation: enTranslations },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "ar", // Get language from localStorage or default to Arabic
  fallbackLng: "ar",
  debug: false, // Enable in development if needed
  interpolation: {
    escapeValue: false,
    format: (value, format) => {
      if (format === "uppercase") return value.toUpperCase();
      if (format === "lowercase") return value.toLowerCase();
      return value;
    },
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
