import React, { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Sun, Moon, RefreshCw, Languages, User, LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import Button from "../components/ui/Button";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Card from "../components/ui/Card";
import type { RootState } from "../store";
import whiteLogo from "/Gold logo.png";
import colorLogo from "/colourfull logo.png";

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-background-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
                {t("navigation.settings.title")}
              </h1>
              <p className="text-gray-600 dark:text-dark-text-secondary mt-1">
                {t("navigation.settings.subtitle")}
              </p>
            </div>

            <div className="space-y-6">
              {/* Appearance Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4">
                  {t("navigation.settings.appearance")}
                </h3>

                <div className="space-y-4">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      {theme === "dark" ? (
                        <Sun className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Moon className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                          {theme === "dark"
                            ? t("app.dayMode")
                            : t("app.nightMode")}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-dark-text-muted">
                          {t("navigation.settings.themeDescription")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTheme}
                      className="p-2"
                    >
                      {t("navigation.enable")}
                    </Button>
                  </div>

                  {/* Language Settings */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Languages className="h-5 w-5 text-green-500" />
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                          {t("navigation.language")}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-dark-text-muted">
                          {t("navigation.settings.languageDescription")}
                        </p>
                      </div>
                    </div>
                    <LanguageSwitcher />
                  </div>
                </div>
              </Card>

              {/* System Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4">
                  {t("navigation.settings.system")}
                </h3>

                <div className="space-y-4">
                  {/* Refresh Data */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <RefreshCw className="h-5 w-5 text-blue-500" />
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                          {t("navigation.refreshData")}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-dark-text-muted">
                          {t("navigation.settings.refreshDescription")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleRefresh}
                      leftIcon={<RefreshCw className="h-4 w-4" />}
                    >
                      {t("navigation.refresh")}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Account Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4">
                  {t("navigation.settings.account")}
                </h3>

                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <User className="h-12 w-12 text-gray-400 bg-gray-100 dark:bg-dark-background-secondary rounded-full p-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getLocalizedUserName()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.role === "admin"
                          ? t("navigation.settings.adminUser")
                          : t("navigation.settings.regularUser")}
                      </p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => (window.location.href = "/login")}
                      leftIcon={<LogOut className="h-4 w-4" />}
                      className="w-full sm:w-auto"
                    >
                      {t("navigation.logout")}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* App Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t("navigation.settings.appInfo")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t("navigation.version")}:
                      </span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t("navigation.settings.status")}
                      </span>
                      <span className="font-medium text-green-600">
                        {t("navigation.settings.workingNormally")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t("navigation.settings.lastUpdate")}
                      </span>
                      <span className="font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center h-80">
                    <img
                      src={theme === "dark" ? whiteLogo : colorLogo}
                      alt="logo"
                      className="h-64 w-64 lg:h-72 lg:w-72 object-contain"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
