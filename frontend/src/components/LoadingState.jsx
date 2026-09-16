import React from 'react';

export default function LoadingState({ message = 'Loading data...' }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center">
      <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-xs font-medium text-[#111111]">{message}</span>
      <span className="text-[11px] text-[#5C5C5C] mt-1">Connecting to database...</span>
    </div>
  );
}
