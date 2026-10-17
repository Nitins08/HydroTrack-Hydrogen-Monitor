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
            className="relative w-full max-w-md bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px] p-6 text-[#171A1C] dark:text-[#F7F5F0] my-8 shadow-lg z-10 transition-colors"
          >
            {/* Warning Icon & Heading */}
            <div className="flex items-start space-x-3 pb-3 border-b border-[#ECE9E2] dark:border-[#252B30]">
              <div className="w-9 h-9 rounded-[2px] bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#171A1C] dark:text-[#F7F5F0]">
                  Delete reading for {readingDate}?
                </h3>
                <p className="text-xs text-[#606870] dark:text-[#8E97A0] mt-1 leading-relaxed">
                  This action will permanently delete this telemetry record from the database.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#606870] dark:text-[#8E97A0] hover:text-[#171A1C] dark:hover:text-[#F7F5F0] transition-colors"
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
                className="px-3.5 py-1.5 bg-white dark:bg-[#252B30] border border-[#E5E2DA] dark:border-[#2C333A] hover:border-gray-900 dark:hover:border-neutral-500 text-[#171A1C] dark:text-[#F7F5F0] rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50"
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
