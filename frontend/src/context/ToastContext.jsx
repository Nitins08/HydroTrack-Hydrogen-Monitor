import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { toastVariants } from '../utils/animations';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating Toast Container */}
      <div 
        aria-live="polite" 
        className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isWarning = toast.type === 'warning';

            return (
              <motion.div
                key={toast.id}
                variants={toastVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
                className={`pointer-events-auto bg-white border border-gray-200 shadow-md rounded-[3px] p-3.5 flex items-start space-x-3 text-xs border-l-4 ${
                  isSuccess
                    ? 'border-l-teal-600 text-gray-900'
                    : isError
                    ? 'border-l-red-600 text-gray-900'
                    : isWarning
                    ? 'border-l-amber-500 text-gray-900'
                    : 'border-l-teal-600 text-gray-900'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isSuccess && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                  {isError && <AlertCircle className="w-4 h-4 text-red-600" />}
                  {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-teal-600" />}
                </div>

                <div className="flex-1 font-medium leading-relaxed text-gray-800">
                  {toast.message}
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0 p-0.5"
                  title="Close notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
