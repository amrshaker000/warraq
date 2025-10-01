import { useState, useCallback } from "react";
import type { ToastProps, ToastType } from "../components/ui/Toast";

interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      type,
      title,
      message,
      duration = 5000,
      persistent = false,
    }: ToastOptions) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: ToastProps = {
        id,
        type,
        title,
        message,
        duration: persistent ? 0 : duration,
        onClose: removeToast,
      };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [removeToast],
  );

  const success = useCallback(
    (
      title: string,
      message?: string,
      options?: {
        duration?: number;
        persistent?: boolean;
        action?: ToastOptions["action"];
      },
    ) => {
      return addToast({
        type: "success",
        title,
        message,
        duration: options?.duration,
        persistent: options?.persistent,
        action: options?.action,
      });
    },
    [addToast],
  );

  const error = useCallback(
    (
      title: string,
      message?: string,
      options?: {
        duration?: number;
        persistent?: boolean;
        action?: ToastOptions["action"];
      },
    ) => {
      return addToast({
        type: "error",
        title,
        message,
        duration: options?.duration,
        persistent: options?.persistent,
        action: options?.action,
      });
    },
    [addToast],
  );

  const warning = useCallback(
    (
      title: string,
      message?: string,
      options?: {
        duration?: number;
        persistent?: boolean;
        action?: ToastOptions["action"];
      },
    ) => {
      return addToast({
        type: "warning",
        title,
        message,
        duration: options?.duration,
        persistent: options?.persistent,
        action: options?.action,
      });
    },
    [addToast],
  );

  const info = useCallback(
    (
      title: string,
      message?: string,
      options?: {
        duration?: number;
        persistent?: boolean;
        action?: ToastOptions["action"];
      },
    ) => {
      return addToast({
        type: "info",
        title,
        message,
        duration: options?.duration,
        persistent: options?.persistent,
        action: options?.action,
      });
    },
    [addToast],
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const updateToast = useCallback(
    (id: string, updates: Partial<ToastProps>) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, ...updates } : toast,
        ),
      );
    },
    [],
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
    updateToast,
  };
};
