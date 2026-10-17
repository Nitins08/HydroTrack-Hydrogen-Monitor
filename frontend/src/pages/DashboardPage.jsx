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
      {/* 1. Dashboard Page Title & Status Header matching Reference Image 2 */}
      <div className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px] p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-2xs transition-colors">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#171A1C] dark:text-[#F7F5F0] tracking-tight">
              Dashboard
            </h1>
            <span className={`inline-flex items-center space-x-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-[2px] border font-semibold ${
              isAdmin
                ? 'bg-[#171A1C] dark:bg-[#252B30] text-white border-[#171A1C] dark:border-[#38414A]'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}>
              {isAdmin ? <ShieldCheck className="w-3 h-3 text-amber-400" /> : <HardHat className="w-3 h-3 text-amber-500" />}
              <span>{user?.role || 'operator'}</span>
            </span>
          </div>

          <p className="text-xs text-[#606870] dark:text-[#8E97A0] mt-1 flex items-center space-x-2">
            <span>{todayDateString}</span>
            <span className="text-gray-300 dark:text-neutral-600">•</span>
            <span>Electrolyzer Facility Plant 01</span>
          </p>
        </div>

        {/* Data Origin & Refresh Badges */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[2px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-300 text-xs font-medium">
            <Database className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Operational Data</span>
          </div>

          {lastUpdated && (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[2px] bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] text-[#606870] dark:text-[#8E97A0] text-xs font-mono">
              <Clock className="w-3 h-3 text-gray-400 dark:text-neutral-500" />
              <span>{lastUpdated}</span>
            </div>
          )}

          <motion.button
            whileHover={shouldReduceMotion ? {} : { y: -1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={fetchDashboard}
            title="Refresh metrics"
            className="p-1.5 bg-white dark:bg-[#252B30] border border-[#E5E2DA] dark:border-[#2C333A] hover:border-amber-500 dark:hover:border-amber-500 text-[#171A1C] dark:text-[#F7F5F0] rounded-[2px] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* 2. Alerts Panel */}
      <AlertPanel alerts={alerts} />

      {/* 3. Four KPI Cards matching Reference Image 2 */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#606870] dark:text-[#8E97A0]">
            Daily Production & Cost Indicators
          </h2>
          <span className="text-xs text-[#606870] dark:text-[#8E97A0] font-mono">Cycle: {period.toUpperCase()}</span>
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

      {/* 4. Production Overview Chart (Amber bars + Charcoal/White Line matching Reference Image 2) */}
      <ChartContainer
        title="Production Overview"
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
              <CartesianGrid strokeDasharray="2 2" stroke={isDark ? '#2C333A' : '#ECE9E2'} vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke={isDark ? '#8E97A0' : '#606870'} 
                tick={{ fill: isDark ? '#8E97A0' : '#606870', fontSize: 11 }} 
                tickLine={false}
              />
              <YAxis 
                stroke={isDark ? '#8E97A0' : '#606870'} 
                domain={['auto', 'auto']} 
                tick={{ fill: isDark ? '#8E97A0' : '#606870', fontSize: 11 }} 
                tickLine={false}
              />
              <Tooltip 
                isAnimationActive={false}
                animationDuration={0}
                animationEasing="linear"
                cursor={{ fill: isDark ? '#252B30' : '#F4F2EC', opacity: 0.5 }}
                content={<ChartTooltip />}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px', color: isDark ? '#F7F5F0' : '#171A1C' }} 
              />
              <Bar 
                dataKey="hydrogenProduced" 
                name="Hydrogen Produced (kg)" 
                fill="#F5A623" 
                isAnimationActive={!shouldReduceMotion}
                animationDuration={800}
                radius={[0, 0, 0, 0]} 
                maxBarSize={34}
              />
              <Line 
                type="monotone" 
                dataKey="hydrogenConsumed" 
                name="Hydrogen Consumed (kg)" 
                stroke={isDark ? '#F7F5F0' : '#171A1C'} 
                isAnimationActive={!shouldReduceMotion}
                animationDuration={900}
                strokeWidth={2} 
                dot={{ r: 3, fill: isDark ? '#F7F5F0' : '#171A1C' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {/* 5. Three Circular Breakdown Cards matching Reference Image 2 Lower Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card A: Production Breakdown */}
        <div className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px] p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:border-gray-300 dark:hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-[#ECE9E2] dark:border-[#252B30]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171A1C] dark:text-[#F7F5F0]">
              Production Breakdown
            </h3>
            <span className="text-[10px] font-mono text-amber-500 font-semibold">Live Share</span>
          </div>

          {/* Circular Donut Visual */}
          <div className="py-4 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" stroke={isDark ? '#252B30' : '#ECE9E2'} strokeWidth="10" fill="transparent" />
                {/* Green Hydrogen Segment (72%) */}
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke="#F5A623" 
                  strokeWidth="10" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 * (1 - 0.72)} 
                  fill="transparent" 
                />
                {/* By-product Segment (18%) */}
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke={isDark ? '#4A5560' : '#8E97A0'} 
                  strokeWidth="10" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 * (1 - 0.18)}
                  transform="rotate(259.2 50 50)"
                  fill="transparent" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-mono font-bold text-[#171A1C] dark:text-[#F7F5F0]">
                  {kpis?.hydrogenProduced?.value ?? 1350}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#606870] dark:text-[#8E97A0]">kg/day</span>
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-1.5 pt-2 border-t border-[#ECE9E2] dark:border-[#252B30] text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-amber-500" />
                <span className="text-[#606870] dark:text-[#8E97A0]">Green Hydrogen</span>
              </div>
              <span className="font-mono font-bold text-[#171A1C] dark:text-[#F7F5F0]">72%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-gray-500 dark:bg-gray-400" />
                <span className="text-[#606870] dark:text-[#8E97A0]">By-product Stream</span>
              </div>
              <span className="font-mono font-bold text-[#171A1C] dark:text-[#F7F5F0]">18%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-gray-300 dark:bg-gray-700" />
                <span className="text-[#606870] dark:text-[#8E97A0]">Electrolyzer Reserve</span>
              </div>
              <span className="font-mono font-bold text-[#171A1C] dark:text-[#F7F5F0]">10%</span>
            </div>
          </div>
        </div>

        {/* Card B: Cost Breakdown */}
        <div className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px] p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:border-gray-300 dark:hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-[#ECE9E2] dark:border-[#252B30]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171A1C] dark:text-[#F7F5F0]">
              Cost Breakdown
            </h3>
            <span className="text-[10px] font-mono text-amber-500 font-semibold">Unit OPEX</span>
          </div>

          {/* Circular Donut Visual */}
          <div className="py-4 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke={isDark ? '#252B30' : '#ECE9E2'} strokeWidth="10" fill="transparent" />
                {/* Energy Segment (55%) */}
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke="#F5A623" 
                  strokeWidth="10" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 * (1 - 0.55)} 
                  fill="transparent" 
                />
                {/* Maintenance Segment (25%) */}
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke={isDark ? '#4A5560' : '#8E97A0'} 
                  strokeWidth="10" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 * (1 - 0.25)}
                  transform="rotate(198 50 50)"
                  fill="transparent" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-mono font-bold text-[#171A1C] dark:text-[#F7F5F0]">
                  {formatCurrency(kpis?.operationalCost?.value ?? 155800)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#606870] dark:text-[#8E97A0]">Total Cost</span>
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-1.5 pt-2 border-t border-[#ECE9E2] dark:border-[#252B30] text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-amber-500" />
                <span className="text-[#606870] dark:text-[#8E97A0]">Electricity & Power</span>
              </div>
              <span className="font-mono font-bold text-[#171A1C] dark:text-[#F7F5F0]">55%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-gray-500 dark:bg-gray-400" />
                <span className="text-[#606870] dark:text-[#8E97A0]">Stack Maintenance</span>
              </div>
              <span className="font-mono font-bold text-[#171A1C] dark:text-[#F7F5F0]">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-[1px] bg-gray-300 dark:bg-gray-700" />
                <span className="text-[#606870] dark:text-[#8E97A0]">Water & Demineralization</span>
              </div>
              <span className="font-mono font-bold text-[#171A1C] dark:text-[#F7F5F0]">20%</span>
            </div>
          </div>
        </div>

        {/* Card C: Sustainability Metrics */}
        <div className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px] p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:border-gray-300 dark:hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-[#ECE9E2] dark:border-[#252B30]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171A1C] dark:text-[#F7F5F0]">
              Sustainability Metrics
            </h3>
            <span className="text-[10px] font-mono text-emerald-500 font-semibold">ESG Rating</span>
          </div>

          <div className="py-4 space-y-3">
            <div className="p-3 bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px]">
              <span className="text-[10px] uppercase font-mono text-[#606870] dark:text-[#8E97A0] block">CO₂ Avoided Today</span>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">4.2</span>
                <span className="text-xs text-[#606870] dark:text-[#8E97A0]">tons / day</span>
              </div>
              <p className="text-[11px] text-[#606870] dark:text-[#8E97A0] mt-1">
                Equivalent to ~190 mature trees planted
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#606870] dark:text-[#8E97A0]">Renewable Power Index</span>
                <span className="font-mono font-bold text-[#171A1C] dark:text-[#F7F5F0]">82.4%</span>
              </div>
              <div className="w-full bg-[#ECE9E2] dark:bg-[#252B30] h-2 rounded-[2px] overflow-hidden">
                <div className="bg-amber-500 h-full w-[82.4%]" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#ECE9E2] dark:border-[#252B30] flex items-center justify-between text-[11px]">
            <span className="text-[#606870] dark:text-[#8E97A0]">Target: Zero Emissions</span>
            <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Net Zero Certified</span>
            </span>
          </div>
        </div>

      </div>

      {/* 6. Recent Daily Readings Table with Staggered Entrance */}
      <div className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px] p-4 sm:p-5 space-y-3.5 hover:border-gray-300 dark:hover:border-neutral-700 transition-colors shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE9E2] dark:border-[#252B30]">
          <div>
            <h3 className="text-sm font-bold text-[#171A1C] dark:text-[#F7F5F0] tracking-tight">Recent Daily Readings</h3>
            <p className="text-xs text-[#606870] dark:text-[#8E97A0] mt-0.5">Chronological log of plant output and operating metrics</p>
          </div>
          <span className="text-xs text-[#606870] dark:text-[#8E97A0] bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] px-2.5 py-0.5 rounded-[2px] font-mono">
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
            <table className="w-full text-left text-xs text-[#171A1C] dark:text-[#F7F5F0] border-collapse">
              <thead>
                <tr className="border-b border-[#E5E2DA] dark:border-[#2C333A] text-[#606870] dark:text-[#8E97A0] font-semibold bg-[#F8F7F4] dark:bg-[#131618]">
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
                className="divide-y divide-[#ECE9E2] dark:divide-[#252B30]"
              >
              {recentReadings.map((row) => {
                const canEdit = isAdmin || (row.createdBy && currentUserId && row.createdBy === currentUserId);
                const canDelete = isAdmin;

                return (
                  <motion.tr 
                    key={row._id} 
                    variants={tableRowVariants}
                    className="hover:bg-amber-500/5 dark:hover:bg-amber-500/10 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-[#171A1C] dark:text-[#F7F5F0] font-mono">{row.date}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-600 dark:text-amber-400 font-mono">{row.hydrogenProduced} kg</td>
                    <td className="py-2.5 px-3 text-right text-[#606870] dark:text-[#8E97A0] font-mono">{row.hydrogenConsumed} kg</td>
                    <td className={`py-2.5 px-3 text-right font-bold font-mono ${row.efficiency >= 90 ? 'text-[#171A1C] dark:text-[#F7F5F0]' : 'text-amber-600 dark:text-amber-400'}`}>
                      {row.efficiency}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#171A1C] dark:text-[#F7F5F0] font-mono">
                      {formatCurrency(row.operationalCost)}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono ${row.costPerKg <= 150 ? 'text-[#171A1C] dark:text-[#F7F5F0]' : 'text-amber-600 dark:text-amber-400 font-bold'}`}>
                      ₹{row.costPerKg}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono ${row.renewableEnergyPct >= 60 ? 'text-[#171A1C] dark:text-[#F7F5F0]' : 'text-amber-600 dark:text-amber-400 font-bold'}`}>
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
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-white dark:bg-[#252B30] border border-[#E5E2DA] dark:border-[#2C333A] hover:border-amber-500 dark:hover:border-amber-500 text-[#171A1C] dark:text-[#F7F5F0] rounded-[2px] text-[11px] font-semibold transition-colors"
                          >
                            <Edit2 className="w-3 h-3 text-amber-500" />
                            <span>Edit</span>
                          </motion.button>
                        )}

                        {canDelete && (
                          <motion.button
                            whileHover={shouldReduceMotion ? {} : { y: -1 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                            onClick={() => setDeleteTarget(row)}
                            title="Delete reading (Admin Only)"
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-white dark:bg-[#252B30] border border-[#E5E2DA] dark:border-[#2C333A] hover:border-red-600 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 text-[#606870] dark:text-[#8E97A0] rounded-[2px] text-[11px] font-semibold transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </motion.button>
                        )}

                        {!canEdit && !canDelete && (
                          <span className="text-[11px] text-gray-400 dark:text-neutral-500 italic">View only</span>
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
