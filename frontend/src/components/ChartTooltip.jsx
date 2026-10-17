import React from 'react';

export default function ChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="custom-chart-tooltip bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-[2px] p-2.5 shadow-md text-xs pointer-events-none min-w-[150px]">
      {label && (
        <div className="font-semibold text-gray-900 dark:text-white pb-1.5 mb-1.5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono font-normal">HydroTrack</span>
        </div>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const val = typeof entry.value === 'number' 
            ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) 
            : entry.value;

          const color = entry.color || entry.fill || entry.stroke || '#0d9488';

          return (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-1.5">
                <span 
                  className="w-2 h-2 inline-block rounded-[1px] flex-shrink-0" 
                  style={{ backgroundColor: color }} 
                />
                <span className="text-gray-600 dark:text-slate-300 text-[11px]">{entry.name}:</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white font-mono text-[11px]">
                {val} {unit && !entry.name?.includes('(') ? unit : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
