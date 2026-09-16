import React from 'react';

export default function ChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="custom-chart-tooltip bg-white border border-[#111111] rounded-[2px] p-2.5 shadow-sm text-xs pointer-events-none min-w-[140px]">
      {label && (
        <div className="font-semibold text-[#111111] pb-1.5 mb-1.5 border-b border-[#E5E5E5]">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const val = typeof entry.value === 'number' 
            ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) 
            : entry.value;

          return (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-1.5">
                <span 
                  className="w-2 h-2 inline-block rounded-[1px] flex-shrink-0" 
                  style={{ backgroundColor: entry.color || entry.fill || entry.stroke || '#111111' }} 
                />
                <span className="text-[#5C5C5C]">{entry.name}:</span>
              </div>
              <span className="font-medium text-[#111111] font-mono">
                {val} {unit && !entry.name?.includes('(') ? unit : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
