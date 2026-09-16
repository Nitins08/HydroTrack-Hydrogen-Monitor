import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  readingDate,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-[#D1D1D1] rounded-[2px] p-6 text-[#111111] my-8 shadow-sm">
        
        {/* Warning Icon & Heading */}
        <div className="flex items-start space-x-3 pb-3 border-b border-[#E5E5E5]">
          <div className="w-8 h-8 rounded-[2px] bg-red-50 border border-red-200 flex items-center justify-center text-red-600 flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111111]">
              Delete reading for {readingDate}?
            </h3>
            <p className="text-xs text-[#5C5C5C] mt-1">
              This action will permanently remove the selected daily reading.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-1.5 bg-white border border-[#D1D1D1] hover:border-black text-[#111111] rounded-[2px] text-xs font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{loading ? 'Deleting...' : 'Delete Reading'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
