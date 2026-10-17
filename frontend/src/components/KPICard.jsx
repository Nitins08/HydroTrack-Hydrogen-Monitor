import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cardVariants } from '../utils/animations';
import AnimatedCounter from './AnimatedCounter';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({
  title,
  value,
  unit = '',
  subText,
  status = 'normal',
  icon: Icon,
  trend,
  prefix = '',
  decimals
}) {
  const shouldReduceMotion = useReducedMotion();

  // Parse numeric value if applicable
  const isNumeric = typeof value === 'number' || (!isNaN(parseFloat(value)) && typeof value === 'string');
  const numericVal = typeof value === 'number' 
    ? value 
    : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;

  // Determine decimal places automatically if not provided
  const derivedDecimals = decimals !== undefined 
    ? decimals 
    : String(value).includes('.') 
    ? 1 
    : 0;

  // Status styling for pills
  const statusColors = {
    normal: {
      badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
    },
    warning: {
      badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      iconBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
    },
    critical: {
      badge: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      iconBg: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
    }
  };

  const currentStatus = statusColors[status] || statusColors.normal;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: 0.15 } }}
      className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] hover:border-amber-400/50 dark:hover:border-amber-500/40 rounded-[4px] p-4 sm:p-5 flex flex-col justify-between transition-all shadow-2xs hover:shadow-sm"
    >
      {/* Top Row: Icon Badge & Uppercase Title */}
      <div className="flex items-center space-x-2.5">
        {Icon && (
          <div className={`w-6 h-6 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${currentStatus.iconBg}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
        <span className="text-[11px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
          {title}
        </span>
      </div>

      {/* Middle Row: Large Value + Unit */}
      <div className="my-3">
        <div className="flex items-baseline space-x-1.5 flex-wrap">
          <div className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-gray-950 dark:text-white font-mono">
            {isNumeric && !String(value).includes('₹') ? (
              <AnimatedCounter
                value={numericVal}
                prefix={prefix}
                decimals={derivedDecimals}
              />
            ) : (
              <span>{value}</span>
            )}
          </div>
          {unit && (
            <span className="text-xs font-semibold text-gray-500 dark:text-neutral-400">
              {unit}
            </span>
          )}
        </div>

        {subText && (
          <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-0.5 truncate">
            {subText}
          </p>
        )}
      </div>

      {/* Bottom Row: Trend Pill & Micro Sparkline Bars (matching Image 2) */}
      <div className="pt-2.5 border-t border-[#ECE9E2] dark:border-[#252B30] flex items-center justify-between gap-1 text-xs">
        {trend?.label ? (
          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-[2px] text-[10.5px] font-bold font-mono border ${
            trend.isPositive
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
          }`}>
            {trend.direction === 'up' && <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
            {trend.direction === 'down' && <TrendingDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
            {trend.direction === 'neutral' && <Minus className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
            <span>{trend.label}</span>
          </span>
        ) : (
          <span className="text-[10.5px] text-gray-400 dark:text-neutral-500 font-mono">Normal Range</span>
        )}

        {/* Decorative Micro-Bars (Image 2 style) */}
        <div className="flex items-end space-x-0.5 h-3 opacity-80" aria-hidden="true">
          <span className="w-1 h-1.5 rounded-2xs bg-amber-500/50" />
          <span className="w-1 h-2 rounded-2xs bg-amber-500/70" />
          <span className="w-1 h-3 rounded-2xs bg-amber-500" />
          <span className="w-1 h-2.5 rounded-2xs bg-amber-500/80" />
        </div>
      </div>
    </motion.div>
  );
}
