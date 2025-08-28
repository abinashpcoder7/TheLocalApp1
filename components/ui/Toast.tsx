
import React, { useEffect, useState } from 'react';
import { Toast as ToastType } from '../../types';
import { X } from 'lucide-react';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 500); // Wait for animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 500);
  };
  
  const animationClass = isExiting ? 'animate-toast-out' : 'animate-toast-in';

  return (
    <div className={`w-full max-w-sm p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-start space-x-4 ${animationClass}`}>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-white">{toast.title}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{toast.description}</p>
      </div>
      <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <X size={16} />
      </button>
    </div>
  );
};


interface ToasterProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {toasts.map(toast => (
        <ToastComponent key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};
