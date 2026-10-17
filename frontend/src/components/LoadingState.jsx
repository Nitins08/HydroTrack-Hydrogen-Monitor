import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function LoadingState({ message = 'Loading system metrics...' }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="py-20 flex flex-col items-center justify-center text-center">
      <div className="relative w-10 h-10 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-amber-100 dark:border-amber-950/60" />
        <div className={`w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent ${shouldReduceMotion ? '' : 'animate-spin'}`} />
      </div>
      <span className="text-xs font-semibold text-gray-950 dark:text-neutral-200 tracking-wide">{message}</span>
      <span className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1 font-mono">
        Connecting to plant telemetry streams...
      </span>
    </div>
  );
}
