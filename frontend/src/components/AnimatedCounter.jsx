import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function AnimatedCounter({
  value,
  duration = 0.8,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}) {
  const shouldReduceMotion = useReducedMotion();
  const numericTarget = typeof value === 'number' ? value : parseFloat(value) || 0;
  const [displayValue, setDisplayValue] = useState(() => (shouldReduceMotion ? numericTarget : 0));

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(numericTarget);
      return;
    }

    let startTimestamp = null;
    let animationFrameId;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = (timestamp - startTimestamp) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (numericTarget - startValue) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(numericTarget);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [numericTarget, duration, shouldReduceMotion]);

  const formattedNumber = decimals > 0 
    ? displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(displayValue).toLocaleString();

  return (
    <span className={className}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}
