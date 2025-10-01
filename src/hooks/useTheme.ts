import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

/**
 * Custom hook for accessing theme context
 *
 * @returns Theme context with theme state and functions
 * @throws Error if used outside ThemeProvider
 *
 * @example
 * ```tsx
 * import { useTheme } from '../hooks/useTheme';
 *
 * function MyComponent() {
 *   const { theme, toggleTheme, isRTL } = useTheme();
 *   // Use theme context...
 * }
 * ```
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
