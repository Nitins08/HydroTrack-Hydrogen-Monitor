import React from 'react';

/**
 * Official HydroTrack Logo component reproducing the flame mark and wordmark
 * from the brand reference images.
 * 
 * Supports:
 * - variant: 'full' (flame + wordmark + subtitle), 'compact' (flame + wordmark), 'icon' (flame only)
 * - size: 'sm', 'md', 'lg'
 */
export function HydroTrackFlame({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative flex-shrink-0 ${dim} ${className}`} aria-label="HydroTrack Logo Mark">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="amberFlameGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
          <linearGradient id="innerWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="innerDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A2F35" />
            <stop offset="100%" stopColor="#14171A" />
          </linearGradient>
        </defs>

        {/* Outer Flame in Amber / Gold */}
        <path
          d="M50 4C50 4 78 36 78 62C78 78.5 65.5 92 50 92C34.5 92 22 78.5 22 62C22 36 50 4 50 4Z"
          fill="url(#amberFlameGrad)"
        />

        {/* Dynamic Curved Inner Leaves/Petals matching Reference */}
        {/* Left inner leaf (charcoal in light, white in dark) */}
        <path
          d="M50 28C50 28 35 46 35 64C35 76 43 85 52 86C45 80 43 72 43 65C43 51 50 28 50 28Z"
          className="fill-[#171A1C] dark:fill-white transition-colors duration-200"
        />

        {/* Right inner leaf (white in light, charcoal in dark) */}
        <path
          d="M50 38C50 38 63 53 63 67C63 77 56 86 48 88C56 84 57 74 57 68C57 56 50 38 50 38Z"
          className="fill-white dark:fill-[#171A1C] transition-colors duration-200"
        />
      </svg>
    </div>
  );
}

export default function HydroTrackLogo({
  variant = 'full',
  size = 'md',
  className = '',
  subtitle = 'Hydrogen Production & Sustainability Monitoring'
}) {
  if (variant === 'icon') {
    return <HydroTrackFlame size={size} className={className} />;
  }

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <HydroTrackFlame size={size} />

      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none text-gray-900 dark:text-white font-black text-lg sm:text-xl">
          <span>Hydro</span>
          <span className="text-amber-500 font-black">Track</span>
        </div>

        {variant === 'full' && subtitle && (
          <span className="text-[9.5px] font-medium tracking-tight text-gray-500 dark:text-neutral-400 leading-tight mt-0.5 max-w-[190px]">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
