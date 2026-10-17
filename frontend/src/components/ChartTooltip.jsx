import React from 'react';

export default function ChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="custom-chart-tooltip bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[4px] p-2.5 shadow-md text-xs pointer-events-none min-w-[160px]">
      {label && (
        <div className="font-semibold text-gray-950 dark:text-white pb-1.5 mb-1.5 border-b border-[#ECE9E2] dark:border-[#252B30] flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">HydroTrack</span>
        </div>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const val = typeof entry.value === 'number' 
            ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) 
            : entry.value;

          const color = entry.color || entry.fill || entry.stroke || '#F5A623';

          return (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-1.5">
                <span 
                  className="w-2 h-2 inline-block rounded-[1px] flex-shrink-0" 
                  style={{ backgroundColor: color }} 
                />
                <span className="text-gray-600 dark:text-neutral-300 text-[11px]">{entry.name}:</span>
              </div>
              <span className="font-bold text-gray-950 dark:text-white font-mono text-[11px]">
                {val} {unit && !entry.name?.includes('(') ? unit : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
