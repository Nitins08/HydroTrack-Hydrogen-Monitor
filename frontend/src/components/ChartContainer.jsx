import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cardVariants } from '../utils/animations';
import { Database, BarChart2 } from 'lucide-react';
import EmptyState from './EmptyState';

export default function ChartContainer({
  title,
  description,
  period,
  onPeriodChange,
  periodOptions = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: 'all', label: 'All Data' },
  ],
  lastUpdated,
  showDataSource = true,
  hasData = true,
  emptyTitle = 'No telemetry data available',
  emptyDescription = 'There is no recorded data for the selected period.',
  emptyAction,
  children
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[4px] p-4 sm:p-5 space-y-4 hover:border-gray-300 dark:hover:border-neutral-700 hover:shadow-xs transition-all"
    >
      {/* Header with Title, Period Filter & Meta Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#ECE9E2] dark:border-[#252B30]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-gray-950 dark:text-white tracking-tight">{title}</h3>
            {showDataSource && (
              <span className="hidden md:inline-flex items-center space-x-1 px-2 py-0.5 rounded-[2px] bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold font-mono">
                <Database className="w-2.5 h-2.5" />
                <span>Simulated Operational Data</span>
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onPeriodChange && (
            <div className="flex items-center space-x-1 bg-[#F8F7F4] dark:bg-[#131618] p-0.5 border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px]">
              {periodOptions.map((opt) => {
                const isActive = period === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    whileHover={shouldReduceMotion ? {} : { y: -1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    onClick={() => onPeriodChange(opt.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-[2px] transition-all ${
                      isActive
                        ? 'bg-[#F5A623] text-gray-950 font-bold shadow-xs'
                        : 'text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#252B30]'
                    }`}
                  >
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>
          )}

          {lastUpdated && (
            <span className="text-[11px] text-gray-400 dark:text-neutral-500 font-mono hidden lg:inline-block">
              Updated: {lastUpdated}
            </span>
          )}
        </div>
      </div>

      {/* Chart Children or Empty State */}
      <div className="w-full">
        {!hasData ? (
          <EmptyState
            icon={BarChart2}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        ) : (
          <div className="overflow-x-auto w-full">
            <div className="min-w-[480px] sm:min-w-0 w-full">
              {children}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
