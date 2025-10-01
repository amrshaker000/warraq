import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/ToastContainer';

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastData = useToast();

  return (
    <ToastContext.Provider value={toastData}>
      {children}
      <ToastContainer toasts={toastData.toasts} onRemoveToast={toastData.removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
