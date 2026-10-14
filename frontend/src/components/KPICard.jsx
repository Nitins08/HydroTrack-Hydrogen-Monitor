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

  // Status styling
  const statusStyles = {
    normal: {
      accent: 'border-l-teal-600',
      badge: 'bg-teal-50 text-teal-800 border-teal-200',
      iconBg: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    warning: {
      accent: 'border-l-amber-500',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    critical: {
      accent: 'border-l-red-600',
      badge: 'bg-red-50 text-red-800 border-red-200',
      iconBg: 'bg-red-50 text-red-700 border-red-200'
    }
  };

  const currentStatus = statusStyles[status] || statusStyles.normal;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: 0.15 } }}
      className={`bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-[3px] p-4 flex flex-col justify-between transition-colors border-l-[3px] ${currentStatus.accent}`}
    >
      {/* Top Header: Title & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {title}
        </span>
        {Icon && (
          <div className={`w-7 h-7 rounded-[2px] border flex items-center justify-center flex-shrink-0 ${currentStatus.iconBg}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Main KPI Value with Animated Counter */}
      <div className="my-2.5">
        <div className="flex items-baseline space-x-1.5 flex-wrap">
          <div className="text-2xl font-bold tracking-tight text-gray-900 font-mono">
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
            <span className="text-xs font-medium text-gray-500">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Trend Badge or Supporting Context */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 gap-1">
        {subText && (
          <span className="truncate text-[11px] text-gray-500">
            {subText}
          </span>
        )}
        {trend && (
          <span className={`inline-flex items-center space-x-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px] border flex-shrink-0 ${
            trend.isPositive === false 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : 'bg-teal-50 text-teal-800 border-teal-200'
          }`}>
            {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{trend.label}</span>
          </span>
        )}
      </div>
    </motion.div>
  );
}
