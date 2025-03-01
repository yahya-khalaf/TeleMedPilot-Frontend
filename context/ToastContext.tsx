"use client";

import { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

type ToastContextType = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useRef<any>(null);

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: 'success',
      detail: message,
      life: 5000,
      className: 'bg-green-600 ml-2 text-white font-semibold rounded-lg shadow-lg p-3',
      contentClassName: 'flex items-center gap-2'
    });
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: 'error',
      detail: message,
      life: 5000,
      className: 'bg-red-600 ml-2 text-white font-semibold rounded-lg shadow-lg p-3',
      contentClassName: 'flex items-center gap-2'
    });
  };

  const showWarning = (message: string) => {
    toast.current?.show({
      severity: 'warn',
      detail: message,
      life: 5000,
      className: 'bg-yellow-600 ml-2 text-white font-semibold rounded-lg shadow-lg p-3',
      contentClassName: 'flex items-center gap-2'
    });
  };

  const showInfo = (message: string) => {
    toast.current?.show({
      severity: 'info',
      detail: message,
      life: 5000,
      className: 'bg-blue-600 ml-2 text-white font-semibold rounded-lg shadow-lg p-3',
      contentClassName: 'flex items-center gap-2'
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 