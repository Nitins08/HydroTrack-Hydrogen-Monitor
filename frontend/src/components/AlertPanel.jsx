import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AlertPanel({ alerts = [] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white border border-[#D1D1D1] border-l-4 border-l-emerald-600 rounded-[2px] p-3 flex items-center space-x-2.5 text-xs text-[#111111]">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span className="font-medium">All systems operating normally: efficiency ≥ 90%, cost ≤ ₹150/kg, renewable share ≥ 60%.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-white border border-[#D1D1D1] border-l-4 border-l-amber-500 rounded-[2px] p-3 flex items-start space-x-2.5 text-xs text-[#111111]"
        >
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <span className="font-semibold text-[#111111]">{alert.title}: </span>
              <span className="text-[#5C5C5C]">{alert.message}</span>
            </div>
            <div className="text-[#5C5C5C] sm:text-right font-mono text-[11px]">
              Current: <strong>{alert.currentValue}</strong> (Limit: {alert.threshold})
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
