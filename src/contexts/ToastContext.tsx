import React, { createContext } from "react";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ui/ToastContainer";

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export { ToastContext };

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toastData = useToast();

  return (
    <ToastContext.Provider value={toastData}>
      {children}
      <ToastContainer
        toasts={toastData.toasts}
        onRemoveToast={toastData.removeToast}
      />
    </ToastContext.Provider>
  );
};
