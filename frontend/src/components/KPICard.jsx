import React from 'react';

export default function KPICard({
  title,
  value,
  unit,
  subText,
  status = 'normal'
}) {
  return (
    <div className="bg-white border border-[#D1D1D1] rounded-[2px] p-4 flex flex-col justify-between h-full">
      {/* 1. Small label */}
      <div className="text-xs font-medium text-[#5C5C5C]">
        {title}
      </div>

      {/* 2. Large value & 3. Unit */}
      <div className="my-2">
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold tracking-tight text-[#111111]">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && (
            <span className="text-xs font-normal text-[#5C5C5C]">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* 4. One simple supporting line */}
      {subText && (
        <div className="pt-2 border-t border-[#E5E5E5] text-xs text-[#5C5C5C] truncate">
          {subText}
        </div>
      )}
    </div>
  );
}
