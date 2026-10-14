import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-6 bg-white border border-gray-200 border-l-[3px] border-l-red-600 rounded-[3px] text-center space-y-3.5 max-w-md mx-auto my-12 shadow-sm"
    >
      <div className="w-10 h-10 rounded-[3px] bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900">Communication Error</h4>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          {message || 'Unable to retrieve data from the backend server.'}
        </p>
      </div>
      {onRetry && (
        <motion.button
          whileHover={shouldReduceMotion ? {} : { y: -1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={onRetry}
          className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-gray-900 hover:bg-black text-white rounded-[2px] text-xs font-semibold transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </motion.button>
      )}
    </motion.div>
  );
}
