import React from 'react';
import { Database, Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function EmptyState({
  icon: Icon = Database,
  title = 'No Data Available',
  description = 'There are no operational records available for the selected period.',
  actionLabel,
  onAction,
  action,
  className = ''
}) {
  const shouldReduceMotion = useReducedMotion();

  const finalActionLabel = action?.label || actionLabel;
  const finalOnAction = action?.onClick || onAction;

  return (
    <div className={`p-8 sm:p-12 text-center flex flex-col items-center justify-center bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[4px] space-y-3 transition-colors ${className}`}>
      <div className="w-12 h-12 rounded-[4px] bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-2xs">
        <Icon className="w-6 h-6" />
      </div>
      <div className="max-w-md space-y-1">
        <h4 className="text-sm font-bold text-gray-950 dark:text-white tracking-tight">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">{description}</p>
      </div>
      {finalActionLabel && finalOnAction && (
        <motion.button
          whileHover={shouldReduceMotion ? {} : { y: -1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={finalOnAction}
          className="mt-2 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-gray-950 rounded-[4px] text-xs font-bold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{finalActionLabel}</span>
        </motion.button>
      )}
    </div>
  );
}
