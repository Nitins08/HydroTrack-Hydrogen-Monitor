import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertOctagon, ShieldCheck } from 'lucide-react';
import { cardVariants } from '../utils/animations';

export default function AlertPanel({ alerts = [] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 border-l-[3px] border-l-teal-600 rounded-[3px] p-3.5 flex items-center justify-between gap-3 text-xs shadow-xs transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-[2px] bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-gray-900 dark:text-white mr-1.5">All Systems Nominal:</span>
            <span className="text-gray-600 dark:text-slate-300">
              Production efficiency ≥ 90%, cost ≤ ₹150/kg, and green energy share ≥ 60%.
            </span>
          </div>
        </div>
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-[2px] text-[10px] font-semibold uppercase font-mono bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex-shrink-0">
          <ShieldCheck className="w-3 h-3 text-teal-700 dark:text-teal-400" />
          <span>Normal</span>
        </span>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2.5">
      {alerts.map((alert) => {
        // Determine severity if provided, or deduce from alert type
        const isCritical = alert.severity === 'critical' || alert.isCritical;

        return (
          <motion.div
            key={alert.id}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            className={`bg-white dark:bg-[#151C28] border rounded-[3px] p-3.5 flex items-start justify-between gap-3 text-xs shadow-xs border-l-[3px] transition-colors ${
              isCritical
                ? 'border-gray-200 dark:border-slate-800 border-l-red-600'
                : 'border-gray-200 dark:border-slate-800 border-l-amber-500'
            }`}
          >
            <div className="flex items-start space-x-2.5 flex-1">
              <div className={`w-6 h-6 rounded-[2px] border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isCritical 
                  ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' 
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
              }`}>
                {isCritical ? (
                  <AlertOctagon className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900 dark:text-white">{alert.title}</span>
                  <span className={`text-[10px] font-semibold uppercase font-mono px-1.5 py-0.2 rounded-[2px] border ${
                    isCritical
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }`}>
                    {isCritical ? 'Critical' : 'Warning'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-gray-500 dark:text-slate-400 flex-shrink-0 self-center hidden sm:block">
              Current: <strong className="text-gray-900 dark:text-white">{alert.currentValue}</strong>{' '}
              <span className="text-gray-400 dark:text-slate-600">|</span> Limit: {alert.threshold}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
