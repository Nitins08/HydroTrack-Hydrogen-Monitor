import React from 'react';

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
  children
}) {
  return (
    <div className="bg-white border border-[#D1D1D1] rounded-[2px] p-4 sm:p-5 space-y-4">
      {/* Header with Title & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#E5E5E5]">
        <div>
          <h3 className="text-sm font-semibold text-[#111111]">{title}</h3>
          {description && <p className="text-xs text-[#5C5C5C] mt-0.5">{description}</p>}
        </div>

        {onPeriodChange && (
          <div className="flex items-center space-x-1 self-start sm:self-auto">
            {periodOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onPeriodChange(opt.id)}
                className={`px-3 py-1 text-xs font-medium border rounded-[2px] transition-colors ${
                  period === opt.id
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#5C5C5C] border-[#D1D1D1] hover:text-[#111111] hover:border-black'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Children */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
