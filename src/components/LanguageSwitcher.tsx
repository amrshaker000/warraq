import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng === "ar" ? "ar" : "en";
  };
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
          i18n.language === "ar"
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
        onClick={() => changeLanguage("ar")}
      >
        العربية
      </button>
      <button
        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
          i18n.language === "en"
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
    </div>
  );
}
