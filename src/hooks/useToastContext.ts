import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

/**
 * Custom hook for accessing toast context
 *
 * @returns Toast context with toast functions and state
 * @throws Error if used outside ToastProvider
 *
 * @example
 * ```tsx
 * import { useToastContext } from '../hooks/useToastContext';
 *
 * function MyComponent() {
 *   const { success, error, toasts } = useToastContext();
 *   // Use toast context...
 * }
 * ```
 */
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};
