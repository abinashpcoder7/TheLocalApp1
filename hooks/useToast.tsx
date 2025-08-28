
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast as ToastType } from '../types';
import { Toaster } from '../components/ui/Toast';

interface ToastContextType {
  toast: (options: Omit<ToastType, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const toast = useCallback((options: Omit<ToastType, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, ...options }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
