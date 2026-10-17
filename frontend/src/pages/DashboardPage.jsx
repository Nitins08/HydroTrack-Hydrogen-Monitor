import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { 
  Edit2, 
  Trash2, 
  Droplets, 
  Activity, 
  Gauge, 
  IndianRupee, 
  Database, 
  Clock, 
  RefreshCw,
  ShieldCheck,
  HardHat
} from 'lucide-react';
import KPICard from '../components/KPICard';
import AlertPanel from '../components/AlertPanel';
import ChartContainer from '../components/ChartContainer';
import ChartTooltip from '../components/ChartTooltip';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { pageVariants, staggerContainer, tableRowVariants } from '../utils/animations';

export default function DashboardPage({ refreshTrigger, onEditReading, onTriggerRefresh }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const isAdmin = user?.role === 'admin';
  const currentUserId = user?._id || user?.id;

  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Time of day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Today's formatted date
  const todayDateString = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboard(period);
      setData(res);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error(err);
      setError('Unable to load dashboard data. Please ensure the backend server and MongoDB are active.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.deleteReading(deleteTarget._id);
      showToast('Daily reading deleted successfully.', 'success');
      setDeleteTarget(null);
      if (onTriggerRefresh) {
        onTriggerRefresh();
      } else {
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || err.message || 'Failed to delete reading.',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [period, refreshTrigger]);

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={fetchDashboard} />;
  }

  const { kpis, chartData = [], alerts = [], recentReadings = [] } = data || {};

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* 1. Welcome Header */}
      <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-2xs transition-colors">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {greeting}, {user?.name || 'Operator'}
            </h1>
            <span className={`inline-flex items-center space-x-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-[2px] border font-semibold ${
              isAdmin
                ? 'bg-gray-900 dark:bg-slate-800 text-white border-gray-900 dark:border-slate-700'
                : 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
            }`}>
              {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <HardHat className="w-3 h-3 text-teal-600 dark:text-teal-400" />}
              <span>{user?.role || 'operator'}</span>
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex items-center space-x-2">
            <span>{todayDateString}</span>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <span>Electrolyzer Facility Plant 01</span>
          </p>
        </div>

        {/* Data Origin & Refresh Badges */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[2px] bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-medium">
            <Database className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Data Source: Simulated Operational Data</span>
          </div>

          {lastUpdated && (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[2px] bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 text-xs font-mono">
              <Clock className="w-3 h-3 text-gray-400 dark:text-slate-500" />
              <span>Updated: {lastUpdated}</span>
            </div>
          )}

          <motion.button
            whileHover={shouldReduceMotion ? {} : { y: -1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={fetchDashboard}
            title="Refresh metrics"
            className="p-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-900 dark:hover:border-slate-500 text-gray-700 dark:text-slate-300 rounded-[2px] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* 2. Alerts Panel */}
      <AlertPanel alerts={alerts} />

      {/* 3. Four KPI Cards with Staggered Entrance */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">
            Daily Production & Cost Indicators
          </h2>
          <span className="text-xs text-gray-500 dark:text-slate-400 font-mono">Cycle: {period.toUpperCase()}</span>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Card 1: Hydrogen Produced */}
          <KPICard
            title="Hydrogen Produced"
            value={kpis?.hydrogenProduced?.value ?? 0}
            unit="kg/day"
            subText={kpis?.hydrogenProduced?.subText}
            status="normal"
            icon={Droplets}
            decimals={1}
            trend={{
              direction: (kpis?.hydrogenProduced?.value ?? 0) >= 1300 ? 'up' : 'neutral',
              label: `${Math.round(((kpis?.hydrogenProduced?.value ?? 0) / 1350) * 100)}% cap`,
              isPositive: true
            }}
          />

          {/* Card 2: Hydrogen Consumed */}
          <KPICard
            title="Hydrogen Consumed"
            value={kpis?.hydrogenConsumed?.value ?? 0}
            unit="kg/day"
            subText={kpis?.hydrogenConsumed?.subText}
            status="normal"
            icon={Activity}
            decimals={1}
            trend={{
              direction: 'neutral',
              label: 'Offtake demand',
              isPositive: true
            }}
          />

          {/* Card 3: Production Efficiency */}
          <KPICard
            title="Production Efficiency"
            value={`${kpis?.productionEfficiency?.value ?? 0}%`}
            unit=""
            subText={kpis?.productionEfficiency?.subText}
            status={(kpis?.productionEfficiency?.value ?? 100) >= 90 ? 'normal' : 'warning'}
            icon={Gauge}
            decimals={1}
            trend={{
              direction: (kpis?.productionEfficiency?.value ?? 0) >= 90 ? 'up' : 'down',
              label: (kpis?.productionEfficiency?.value ?? 0) >= 90 ? 'Optimal ≥90%' : 'Low <90%',
              isPositive: (kpis?.productionEfficiency?.value ?? 0) >= 90
            }}
          />

          {/* Card 4: Operational Cost */}
          <KPICard
            title="Operational Cost"
            value={formatCurrency(kpis?.operationalCost?.value ?? 0)}
            unit=""
            subText={kpis?.operationalCost?.subText}
            status="normal"
            icon={IndianRupee}
            trend={{
              direction: 'neutral',
              label: 'Plant OPEX',
              isPositive: true
            }}
          />
        </motion.div>
      </div>

      {/* 4. Hydrogen Produced vs Hydrogen Consumed Chart */}
      <ChartContainer
        title="Daily Production Overview"
        description="Daily comparison between green hydrogen produced and consumer offtake (kg/day)"
        period={period}
        onPeriodChange={setPeriod}
        lastUpdated={lastUpdated}
        hasData={chartData.length > 0}
        emptyTitle="No production telemetry logged"
        emptyDescription="There are no hydrogen production or consumption logs available for this cycle."
      >
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={isDark ? '#334155' : '#F1F5F9'} vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke={isDark ? '#94A3B8' : '#64748B'} 
                tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} 
                tickLine={false}
              />
              <YAxis 
                stroke={isDark ? '#94A3B8' : '#64748B'} 
                domain={['auto', 'auto']} 
                tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} 
                tickLine={false}
              />
              <Tooltip 
                isAnimationActive={false}
                animationDuration={0}
                animationEasing="linear"
                cursor={{ fill: isDark ? '#1E293B' : '#F8FAFC', opacity: 0.5 }}
                content={<ChartTooltip />}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', color: isDark ? '#CBD5E1' : '#111827' }} />
              <Bar 
                dataKey="hydrogenProduced" 
                name="Hydrogen Produced (kg)" 
                fill="#0d9488" 
                isAnimationActive={!shouldReduceMotion}
                animationDuration={800}
                radius={[0, 0, 0, 0]} 
                maxBarSize={34}
              />
              <Line 
                type="monotone" 
                dataKey="hydrogenConsumed" 
                name="Hydrogen Consumed (kg)" 
                stroke={isDark ? '#38bdf8' : '#111827'} 
                isAnimationActive={!shouldReduceMotion}
                animationDuration={900}
                strokeWidth={2} 
                dot={{ r: 2.5, fill: isDark ? '#38bdf8' : '#111827' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {/* 5. Recent Daily Readings Table with Staggered Entrance */}
      <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-4 sm:p-5 space-y-3.5 hover:border-gray-300 dark:hover:border-slate-700 transition-colors shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">Recent Daily Readings</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Chronological log of plant output and operating metrics</p>
          </div>
          <span className="text-xs text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2.5 py-0.5 rounded-[2px] font-mono">
            {recentReadings.length} records
          </span>
        </div>

        {recentReadings.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No recent readings recorded"
            description="No plant readings have been saved for this cycle. Use the Add Reading button above to record the day's telemetry."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-900 dark:text-slate-200 border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 font-semibold bg-gray-50 dark:bg-slate-800/60">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Produced</th>
                  <th className="py-2.5 px-3 text-right">Consumed</th>
                  <th className="py-2.5 px-3 text-right">Efficiency</th>
                  <th className="py-2.5 px-3 text-right">Total Cost</th>
                  <th className="py-2.5 px-3 text-right">Cost / kg</th>
                  <th className="py-2.5 px-3 text-right">Renewable %</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="divide-y divide-gray-100 dark:divide-slate-800/80"
              >
              {recentReadings.map((row) => {
                const canEdit = isAdmin || (row.createdBy && currentUserId && row.createdBy === currentUserId);
                const canDelete = isAdmin;

                return (
                  <motion.tr 
                    key={row._id} 
                    variants={tableRowVariants}
                    className="hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white font-mono">{row.date}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-teal-700 dark:text-teal-400 font-mono">{row.hydrogenProduced} kg</td>
                    <td className="py-2.5 px-3 text-right text-gray-600 dark:text-slate-400 font-mono">{row.hydrogenConsumed} kg</td>
                    <td className={`py-2.5 px-3 text-right font-bold font-mono ${row.efficiency >= 90 ? 'text-gray-900 dark:text-slate-200' : 'text-amber-600 dark:text-amber-400'}`}>
                      {row.efficiency}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-900 dark:text-slate-200 font-mono">
                      {formatCurrency(row.operationalCost)}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono ${row.costPerKg <= 150 ? 'text-gray-900 dark:text-slate-200' : 'text-amber-600 dark:text-amber-400 font-bold'}`}>
                      ₹{row.costPerKg}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono ${row.renewableEnergyPct >= 60 ? 'text-gray-900 dark:text-slate-200' : 'text-amber-600 dark:text-amber-400 font-bold'}`}>
                      {row.renewableEnergyPct}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {canEdit && (
                          <motion.button
                            whileHover={shouldReduceMotion ? {} : { y: -1 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                            onClick={() => onEditReading && onEditReading(row)}
                            title="Edit reading"
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-gray-900 dark:hover:border-slate-500 text-gray-800 dark:text-slate-200 rounded-[2px] text-[11px] font-semibold transition-colors"
                          >
                            <Edit2 className="w-3 h-3 text-teal-700 dark:text-teal-400" />
                            <span>Edit</span>
                          </motion.button>
                        )}

                        {canDelete && (
                          <motion.button
                            whileHover={shouldReduceMotion ? {} : { y: -1 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                            onClick={() => setDeleteTarget(row)}
                            title="Delete reading (Admin Only)"
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-red-600 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-slate-400 rounded-[2px] text-[11px] font-semibold transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </motion.button>
                        )}

                        {!canEdit && !canDelete && (
                          <span className="text-[11px] text-gray-400 dark:text-slate-500 italic">View only</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        readingDate={deleteTarget?.date}
        loading={deleteLoading}
      />

    </motion.div>
  );
}
