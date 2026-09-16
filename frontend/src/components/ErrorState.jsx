import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="p-6 bg-white border border-[#D1D1D1] border-l-4 border-l-red-600 rounded-[2px] text-center space-y-3 max-w-md mx-auto my-12">
      <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
        <AlertTriangle className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[#111111]">Connection Error</h4>
        <p className="text-xs text-[#5C5C5C] mt-1">{message || 'Unable to retrieve data from server.'}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#111111] hover:bg-black text-white rounded-[2px] text-xs font-medium transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
