import React from 'react';

export function SkeletonKPICard() {
  return (
    <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 border-l-[3px] border-l-gray-300 dark:border-l-slate-700 rounded-[3px] p-4 flex flex-col justify-between h-[116px] animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-28" />
        <div className="w-7 h-7 bg-gray-100 dark:bg-slate-800 rounded-[2px]" />
      </div>
      <div className="my-2">
        <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded w-32" />
      </div>
      <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
        <div className="h-2.5 bg-gray-100 dark:bg-slate-800 rounded w-24" />
        <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-16" />
      </div>
    </div>
  );
}

export function SkeletonKPIGrid({ count = 4, cols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' }) {
  return (
    <div className={`grid ${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonKPICard key={i} />
      ))}
    </div>
  );
}

export function SkeletonChart({ height = 'h-72' }) {
  return (
    <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-4 sm:p-5 space-y-4 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-44" />
          <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-64" />
        </div>
        <div className="h-7 bg-gray-100 dark:bg-slate-800 rounded w-48" />
      </div>
      <div className={`${height} w-full bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded flex items-center justify-center`}>
        <div className="flex items-end space-x-3 h-40">
          <div className="w-8 bg-gray-200 dark:bg-slate-700 h-24 rounded-t" />
          <div className="w-8 bg-gray-200 dark:bg-slate-700 h-36 rounded-t" />
          <div className="w-8 bg-gray-200 dark:bg-slate-700 h-28 rounded-t" />
          <div className="w-8 bg-gray-200 dark:bg-slate-700 h-32 rounded-t" />
          <div className="w-8 bg-gray-200 dark:bg-slate-700 h-20 rounded-t" />
          <div className="w-8 bg-gray-200 dark:bg-slate-700 h-36 rounded-t" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-4 sm:p-5 space-y-3.5 animate-pulse">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-36" />
          <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-52" />
        </div>
        <div className="h-5 bg-gray-100 dark:bg-slate-800 rounded w-20" />
      </div>
      <div className="space-y-2.5">
        <div className="h-8 bg-gray-100 dark:bg-slate-800 rounded w-full" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-9 bg-gray-50 dark:bg-slate-900/60 rounded w-full border-b border-gray-100 dark:border-slate-800" />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-56" />
          <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-40" />
        </div>
        <div className="h-7 bg-gray-100 dark:bg-slate-800 rounded w-52" />
      </div>

      {/* Alert Skeleton */}
      <div className="h-11 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 border-l-[3px] border-l-gray-300 dark:border-l-slate-700 rounded-[3px] animate-pulse" />

      {/* KPI Cards Skeleton */}
      <SkeletonKPIGrid count={4} />

      {/* Chart Skeleton */}
      <SkeletonChart />

      {/* Table Skeleton */}
      <SkeletonTable rows={4} />
    </div>
  );
}

export default DashboardSkeleton;
