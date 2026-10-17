import React from 'react';
import { Database, Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function EmptyState({
  icon: Icon = Database,
  title = 'No Data Available',
  description = 'There are no operational records available for the selected period.',
  actionLabel,
  onAction,
  className = ''
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-white border border-gray-200 rounded-[3px] space-y-3 ${className}`}>
      <div className="w-12 h-12 rounded-[3px] bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-2xs">
        <Icon className="w-6 h-6" />
      </div>
      <div className="max-w-md space-y-1">
        <h4 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <motion.button
          whileHover={shouldReduceMotion ? {} : { y: -1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={onAction}
          className="mt-2 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-[2px] text-xs font-semibold transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </div>
  );
}
