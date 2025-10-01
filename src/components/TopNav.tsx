import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { logout } from "../slices/authSlice";
import { useToastContext } from "../hooks/useToastContext";
import type { RootState } from "../store";
import goldLogo from "/Gold logo.png";
import colorLogo from "/colourfull logo.png";
import { clsx } from "clsx";
import Button from "./ui/Button";
import { Menu, User, LogOut, Sun, Moon, RefreshCw } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

interface TopNavProps {
  onMenuClick?: () => void;
}
const TopNav: React.FC<TopNavProps> = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { addToast } = useToastContext();

  // دالة للحصول على اسم المستخدم باللغة المناسبة
  const getLocalizedUserName = () => {
    if (!user) return t("navigation.settings.systemAdmin");

    // التحقق من اللغة الحالية
    const currentLanguage = i18n.language;

    // إذا كانت اللغة إنجليزية، استخدم الاسم الإنجليزي إن وجد
    if (currentLanguage === "en" && user.displayNameEn) {
      return user.displayNameEn;
    }

    // وإلا استخدم الاسم العربي أو الاحتياطي
    return user.displayName || t("navigation.settings.systemAdmin");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleRefresh = () => {
    addToast({
      type: "success",
      title: t("common.success"),
      message: t("common.refreshSuccess"),
    });
    setTimeout(() => window.location.reload(), 250);
  };

  return (
    <header className="sticky top-0 z-50 h-16 w-full flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Mobile Menu Button */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className={clsx(
            "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 rounded-lg hover:scale-110 active:scale-95",
            "transform hover:rotate-12 active:rotate-0",
          )}
          title={t("navigation.menuButtonTitle")}
        >
          <Menu className="h-5 w-5 transition-all duration-300 hover:text-blue-600" />
        </Button>
        {/* Logo */}
        <img
          src={theme === "dark" ? goldLogo : colorLogo}
          alt="logo"
          className="h-10 w-10 rounded-lg shadow-lg object-contain mr-2"
        />
        <div className="hidden lg:flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("app.title")}
          </h1>
        </div>
        {/* Mobile Title */}
        <div className="lg:hidden">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {t("app.title")}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
        {/* Language Switcher - Desktop Only */}
        <div className="hidden lg:block">
          <LanguageSwitcher />
        </div>

        {/* Theme Toggle - Desktop Only */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title={
            theme === "dark"
              ? t("navigation.dayMode")
              : t("navigation.nightMode")
          }
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </Button>

        {/* Refresh Button - Desktop Only */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title={t("navigation.refreshData")}
        >
          <RefreshCw className="h-5 w-5 text-green-500" />
        </Button>

        {/* User Menu - Desktop Only */}
        {isAuthenticated && (
          <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4" />
              <span className="hidden xl:inline font-medium">
                {getLocalizedUserName()}
              </span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
              title={t("navigation.logout")}
            >
              <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
