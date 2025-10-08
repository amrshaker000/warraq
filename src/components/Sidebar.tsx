import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Database,
  X,
  LogOut,
  Sun,
  Moon,
  Languages,
  User,
} from "lucide-react";
import { clsx } from "clsx";
import goldLogo from "/Gold logo.png";
import colorLogo from "/colourfull logo.png";
import PermissionGuard from "./PermissionGuard";
import { useTheme } from "../hooks/useTheme";
import { logout } from "../slices/authSlice";
import type { RootState } from "../store";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  translationKey: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isRTL = i18n.language === "ar";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const navigation: NavItem[] = [
    {
      name: "Home",
      href: "/home",
      icon: <LayoutDashboard className="h-5 w-5" />,
      translationKey: "navigation.home",
    },
    {
      name: "Members",
      href: "/members",
      icon: <Users className="h-5 w-5" />,
      translationKey: "navigation.members",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      translationKey: "navigation.analytics",
    },
  ];

  const secondaryNavigation: NavItem[] = [
    {
      name: "Backup",
      href: "/backup",
      icon: <Database className="h-5 w-5" />,
      translationKey: "common.backup",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      translationKey: "navigation.settings.title",
    },
  ];

  // Prevent event propagation when clicking inside the sidebar
  const handleSidebarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[55] lg:hidden transition-all duration-200 ease-in-out"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        key={`sidebar-${isRTL ? "rtl" : "ltr"}`}
        className={clsx(
          "fixed inset-y-0 z-[60] w-64 bg-white dark:bg-dark-background-primary border-gray-200 dark:border-dark-border-primary flex flex-col transform transition-all duration-200 ease-in-out",
          isRTL ? "right-0 border-l" : "left-0 border-r",
          isOpen
            ? "translate-x-0 opacity-100"
            : "opacity-0 pointer-events-none",
          isOpen
            ? "translate-x-0"
            : isRTL
              ? "translate-x-full"
              : "-translate-x-full",
        )}
        onClick={handleSidebarClick}
      >
        {/* Desktop Close Button - Always Visible */}
        <div
          className={clsx(
            "hidden lg:flex items-center p-2",
            isRTL ? "justify-start" : "justify-end",
          )}
        >
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-background-secondary text-gray-600 dark:text-dark-text-secondary"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Close Button */}
        <div
          className={clsx(
            "flex items-center justify-between p-4 lg:hidden border-b border-gray-200 dark:border-dark-border-primary",
            isRTL ? "flex-row-reverse" : "flex-row",
          )}
        >
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src={theme === "dark" ? goldLogo : colorLogo}
              alt="logo"
              className="h-16 w-16 object-contain"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-background-secondary"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-dark-text-secondary" />
          </button>
        </div>

        {/* Logo - Desktop */}
        <div className="hidden lg:block p-6 border-b border-gray-200 dark:border-dark-border-primary">
          <div className="flex justify-center">
            <img
              src={theme === "dark" ? goldLogo : colorLogo}
              alt="logo"
              className="h-32 w-32 object-contain"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isRTL ? "hover:-translate-x-1" : "hover:translate-x-1",
                    isActive
                      ? "bg-primary-100 text-primary-700 dark:bg-dark-accent-red-900 dark:text-dark-accent-red-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-dark-text-primary dark:hover:bg-dark-background-secondary",
                  )
                }
              >
                {item.icon}
                <span>{t(item.translationKey)}</span>
              </NavLink>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-dark-border-primary my-4" />

          {/* Secondary Navigation */}
          <div className="space-y-1">
            {secondaryNavigation.map((item) => {
              // Check if user has permission for this item
              const requiresAdmin =
                item.name === "Backup" || item.name === "Settings";

              return (
                <PermissionGuard
                  key={item.name}
                  permissions={requiresAdmin ? ["admin"] : []}
                >
                  <NavLink
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isRTL ? "hover:-translate-x-1" : "hover:translate-x-1",
                        isActive
                          ? "bg-primary-100 text-primary-700 dark:bg-dark-accent-red-900 dark:text-dark-accent-red-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-dark-text-primary dark:hover:bg-dark-background-secondary",
                      )
                    }
                  >
                    {item.icon}
                    <span>{t(item.translationKey)}</span>
                  </NavLink>
                </PermissionGuard>
              );
            })}
          </div>
        </nav>

        {/* User Controls Section - Mobile Only for Regular Users */}
        {user && user.role === "user" && (
          <div className="lg:hidden p-4 border-t border-gray-200 dark:border-dark-border-primary space-y-3">
            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-dark-background-secondary rounded-lg">
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-gray-400 bg-gray-100 dark:bg-dark-background-tertiary rounded-full p-1.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-text-primary truncate">
                    {isRTL ? user.displayName : user.displayNameEn}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-muted">
                    {t("navigation.settings.regularUser")}
                  </p>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center space-x-2 rtl:space-x-reverse p-2 rounded-lg bg-gray-100 dark:bg-dark-background-secondary hover:bg-gray-200 dark:hover:bg-dark-background-tertiary transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-xs font-medium text-gray-700 dark:text-dark-text-primary">
                  {theme === "dark" ? t("app.dayMode") : t("app.nightMode")}
                </span>
              </button>

              {/* Language Toggle */}
              <button
                onClick={() => {
                  const newLang = i18n.language === "ar" ? "en" : "ar";
                  i18n.changeLanguage(newLang);
                  localStorage.setItem("language", newLang);
                  document.documentElement.dir =
                    newLang === "ar" ? "rtl" : "ltr";
                  document.documentElement.lang =
                    newLang === "ar" ? "ar" : "en";
                  onClose?.();
                }}
                className="flex items-center justify-center space-x-2 rtl:space-x-reverse p-2 rounded-lg bg-gray-100 dark:bg-dark-background-secondary hover:bg-gray-200 dark:hover:bg-dark-background-tertiary transition-colors"
              >
                <Languages className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-dark-text-primary">
                  {i18n.language === "ar" ? "EN" : "العربية"}
                </span>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/login");
                onClose?.();
              }}
              className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse p-3 rounded-lg bg-red-50 dark:bg-dark-accent-red-900/20 hover:bg-red-100 dark:hover:bg-dark-accent-red-900/30 text-red-600 dark:text-dark-accent-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">
                {t("navigation.logout")}
              </span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-border-primary">
          <p className="text-xs text-gray-500 dark:text-dark-text-muted text-center">
            {t("footer.copyright")} &copy; {new Date().getFullYear()}
          </p>
          <p className="text-xs text-gray-500 dark:text-dark-text-muted text-center mt-1">
            {t("footer.partyName")}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
