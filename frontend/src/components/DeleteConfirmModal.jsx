import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { modalOverlayVariants, modalContentVariants } from '../utils/animations';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  readingDate,
  loading = false
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            variants={modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
          />

          {/* Modal Dialog */}
          <motion.div
            variants={shouldReduceMotion ? {} : modalContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-md bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-6 text-gray-900 dark:text-white my-8 shadow-lg z-10 transition-colors"
          >
            {/* Warning Icon & Heading */}
            <div className="flex items-start space-x-3 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-[2px] bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Delete reading for {readingDate}?
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                  This action will permanently delete this telemetry record from the database.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-gray-900 dark:hover:border-slate-500 text-gray-800 dark:text-slate-200 rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <motion.button
                whileHover={shouldReduceMotion ? {} : { y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex items-center space-x-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{loading ? 'Deleting...' : 'Confirm Delete'}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
