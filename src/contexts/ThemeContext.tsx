import React, { createContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isRTL: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "light"; // Default to light mode
  });
  const [isRTL, setIsRTL] = useState<boolean>(() => {
    const savedLang = (localStorage.getItem("language") || "ar").toLowerCase();
    return savedLang === "ar";
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") || "ar").toLowerCase();
    const rtl = savedLang === "ar";
    setIsRTL(rtl);
    // Apply language direction and lang attribute
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.lang = rtl ? "ar" : "en";
    // Apply font family conditionally
    if (rtl) {
      document.body.classList.add("font-arabic");
    } else {
      document.body.classList.remove("font-arabic");
    }
  }, []);

  const toggleTheme = () => {
    // Add a small delay for smooth transition
    setTimeout(() => {
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, 100); // 100ms delay for smooth transition
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isRTL,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
