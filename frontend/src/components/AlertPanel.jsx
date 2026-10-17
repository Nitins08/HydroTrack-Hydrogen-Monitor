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
        className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] border-l-[3px] border-l-emerald-600 dark:border-l-emerald-500 rounded-[4px] p-3.5 flex items-center justify-between gap-3 text-xs shadow-2xs transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-[2px] bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-gray-950 dark:text-white mr-1.5">All Systems Nominal:</span>
            <span className="text-gray-600 dark:text-neutral-300">
              Production efficiency ≥ 90%, cost ≤ ₹150/kg, and green energy share ≥ 60%.
            </span>
          </div>
        </div>
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-[2px] text-[10px] font-semibold uppercase font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
          <ShieldCheck className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
          <span>Normal</span>
        </span>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2.5">
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'critical' || alert.isCritical;

        return (
          <motion.div
            key={alert.id}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            className={`bg-white dark:bg-[#1D2226] border rounded-[4px] p-3.5 flex items-start justify-between gap-3 text-xs shadow-2xs border-l-[3px] transition-colors ${
              isCritical
                ? 'border-[#E5E2DA] dark:border-[#2C333A] border-l-red-600'
                : 'border-[#E5E2DA] dark:border-[#2C333A] border-l-amber-500'
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
                  <span className="font-bold text-gray-950 dark:text-white">{alert.title}</span>
                  <span className={`text-[10px] font-semibold uppercase font-mono px-1.5 py-0.2 rounded-[2px] border ${
                    isCritical
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }`}>
                    {isCritical ? 'Critical' : 'Warning'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-neutral-300 text-[11px] leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-gray-500 dark:text-neutral-400 flex-shrink-0 self-center hidden sm:block">
              Current: <strong className="text-gray-950 dark:text-white">{alert.currentValue}</strong>{' '}
              <span className="text-gray-400 dark:text-neutral-600">|</span> Limit: {alert.threshold}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
