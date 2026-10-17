import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { 
  Zap, 
  Gauge, 
  TrendingUp, 
  Droplet, 
  IndianRupee, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import KPICard from '../components/KPICard';
import ChartContainer from '../components/ChartContainer';
import ChartTooltip from '../components/ChartTooltip';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { SkeletonKPIGrid, SkeletonChart } from '../components/SkeletonLoader';
import { useTheme } from '../context/ThemeContext';
import { pageVariants, staggerContainer, cardVariants } from '../utils/animations';

export default function AnalyticsPage({ refreshTrigger }) {
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAnalytics(period);
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch analytics data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period, refreshTrigger]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200/70 animate-pulse rounded-[3px] w-64" />
        <SkeletonKPIGrid count={5} />
        <SkeletonChart />
      </div>
    );
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={fetchAnalytics} />;
  }

  const { summary = {}, targetVsActualChart = [], formulas = [], costBreakdown = [] } = data || {};

  const efficiencyVal = summary.productionEfficiency ?? 0;
  const isEfficiencyOptimal = efficiencyVal >= 90;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* 1. Header & Summary Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Production & Energy Analytics
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Production yield, specific energy consumption, and operating unit economics
            </p>
          </div>
          <span className="text-xs text-gray-600 dark:text-slate-300 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 px-3 py-1 rounded-[2px] font-mono self-start sm:self-auto shadow-2xs">
            Cycle: <strong className="text-teal-700 dark:text-teal-400">{period.toUpperCase()}</strong> ({summary.daysCount || 0} Days)
          </span>
        </div>

        {/* 5 KPI Metric Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {/* Total Produced */}
          <KPICard
            title="Total H₂ Produced"
            value={summary.totalHydrogenProduced ?? 0}
            unit="kg"
            subText={`Cum. volume (${summary.daysCount || 30} days)`}
            status="normal"
            icon={TrendingUp}
            decimals={0}
          />

          {/* Average Daily Production */}
          <KPICard
            title="Avg Daily Output"
            value={summary.averageDailyProduction ?? 0}
            unit="kg/day"
            subText="Rated benchmark: 1,350 kg/day"
            status="normal"
            icon={Gauge}
            decimals={1}
            trend={{
              direction: (summary.averageDailyProduction ?? 0) >= 1250 ? 'up' : 'neutral',
              label: `${Math.round(((summary.averageDailyProduction ?? 0) / 1350) * 100)}% load`,
              isPositive: true
            }}
          />

          {/* Production Efficiency */}
          <KPICard
            title="Production Efficiency"
            value={`${efficiencyVal}%`}
            unit=""
            subText="Actual vs Target ratio"
            status={isEfficiencyOptimal ? 'normal' : 'warning'}
            icon={Gauge}
            decimals={1}
            trend={{
              direction: isEfficiencyOptimal ? 'up' : 'down',
              label: isEfficiencyOptimal ? 'Pass (≥90%)' : 'Derated (<90%)',
              isPositive: isEfficiencyOptimal
            }}
          />

          {/* Total Energy Consumed */}
          <KPICard
            title="Total Energy Input"
            value={summary.totalEnergyConsumed ?? 0}
            unit="MWh"
            subText="Stack power input"
            status="normal"
            icon={Zap}
            decimals={1}
          />

          {/* Specific Energy Efficiency */}
          <KPICard
            title="Energy Efficiency"
            value={summary.energyEfficiency ?? 0}
            unit="kg/MWh"
            subText={`Unit Cost: ₹${summary.costPerKg ?? 0}/kg`}
            status="normal"
            icon={IndianRupee}
            decimals={1}
          />
        </motion.div>
      </div>

      {/* 2. Target Production vs Actual Production Chart */}
      <ChartContainer
        title="Target vs Actual Production"
        description="Daily green hydrogen output (kg/day) benchmarked against plant capacity baseline"
        period={period}
        onPeriodChange={setPeriod}
        hasData={targetVsActualChart.length > 0}
        emptyTitle="No production target comparisons available"
        emptyDescription="There are no data points available for the selected cycle."
      >
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={targetVsActualChart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                content={<ChartTooltip unit="kg" />}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', color: isDark ? '#CBD5E1' : '#111827' }} />
              <Bar 
                dataKey="actualProduction" 
                name="Actual Production (kg)" 
                fill="#0d9488" 
                isAnimationActive={!shouldReduceMotion}
                animationDuration={800}
                radius={[0, 0, 0, 0]} 
                maxBarSize={34}
              />
              <Line 
                type="monotone" 
                dataKey="targetProduction" 
                name="Target Benchmark (1,350 kg/day)" 
                stroke={isDark ? '#38bdf8' : '#111827'} 
                isAnimationActive={!shouldReduceMotion}
                animationDuration={900}
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {/* 3. Production Efficiency Progress Indicator & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Production Efficiency Gauge & Benchmark */}
        <motion.div 
          variants={cardVariants}
          className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-4 sm:p-5 space-y-4 hover:border-gray-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
        >
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Efficiency Index</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Electrolyzer yield against target</p>
            </div>
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold uppercase font-mono rounded-[2px] border ${
              isEfficiencyOptimal
                ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}>
              {isEfficiencyOptimal ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              <span>{isEfficiencyOptimal ? 'Nominal' : 'Warning'}</span>
            </span>
          </div>

          {/* Efficiency Progress Indicator Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">Plant Output Efficiency</span>
              <span className="text-xl font-bold font-mono text-gray-900 dark:text-white">{efficiencyVal}%</span>
            </div>

            {/* Visual multi-segmented bar with target mark */}
            <div className="relative w-full bg-gray-100 dark:bg-slate-800 h-3 rounded-[2px] overflow-hidden border border-gray-200 dark:border-slate-700">
              <motion.div
                initial={shouldReduceMotion ? { width: `${efficiencyVal}%` } : { width: 0 }}
                animate={{ width: `${Math.min(efficiencyVal, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full ${
                  isEfficiencyOptimal ? 'bg-teal-600' : 'bg-amber-500'
                }`}
              />
              {/* 90% benchmark indicator line */}
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-red-600 z-10" 
                style={{ left: '90%' }}
                title="Minimum warning threshold (90%)"
              />
            </div>

            <div className="flex justify-between text-[11px] text-gray-400 dark:text-slate-500 font-mono">
              <span>0%</span>
              <span className="text-red-600 dark:text-red-400 font-semibold">90% Threshold</span>
              <span>100% Target</span>
            </div>
          </div>

          {/* Context note */}
          <div className="p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 rounded-[2px] text-xs space-y-1.5 text-gray-600 dark:text-slate-400">
            <div className="font-semibold text-gray-900 dark:text-slate-200 flex items-center space-x-1.5">
              <span>Operational Guideline:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Target nameplate capacity is calibrated to 1,350 kg/day. Operating below 90% triggers automated alerts for electrolyzer cell stack maintenance.
            </p>
          </div>
        </motion.div>

        {/* Right Cards: Operational Cost Breakdown (Stacked & Items) */}
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-2 bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-4 sm:p-5 space-y-4 hover:border-gray-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2.5 border-b border-gray-100 dark:border-slate-800 gap-2">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Operational Cost Breakdown</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Total operating expenditure: <strong className="text-gray-900 dark:text-slate-200 font-mono">{formatCurrency(summary.totalOperationalCost ?? 0)}</strong>
              </p>
            </div>
            <div className="text-xs font-mono bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-2.5 py-1 rounded-[2px] self-start sm:self-auto font-semibold">
              Avg Cost: ₹{summary.costPerKg ?? 0} / kg H₂
            </div>
          </div>

          {/* Unified multi-color breakdown bar */}
          <div className="w-full h-3 rounded-[2px] overflow-hidden flex border border-gray-200 dark:border-slate-700">
            {costBreakdown.map((item, index) => {
              const colors = ['bg-teal-600', 'bg-slate-700', 'bg-amber-500'];
              return (
                <div
                  key={item.name}
                  className={`${colors[index % colors.length]} h-full transition-all`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.name}: ${item.percentage}%`}
                />
              );
            })}
          </div>

          {/* Individual cost items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {costBreakdown.map((item, index) => {
              const borderColors = ['border-l-teal-600', 'border-l-slate-700', 'border-l-amber-500'];
              const dotColors = ['bg-teal-600', 'bg-slate-700', 'bg-amber-500'];

              return (
                <div 
                  key={item.name} 
                  className={`p-3 bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 border-l-[3px] ${borderColors[index % borderColors.length]} rounded-[2px] space-y-1`}
                >
                  <div className="flex items-center space-x-1.5 text-xs text-gray-600 dark:text-slate-400">
                    <span className={`w-2 h-2 rounded-[1px] ${dotColors[index % dotColors.length]}`} />
                    <span className="font-semibold text-gray-900 dark:text-slate-200">{item.name}</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                    {formatCurrency(item.amount)}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400 font-mono">
                    {item.percentage}% of total OPEX
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-gray-400 dark:text-slate-500 font-mono flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
            <span>Electricity tariff: ~₹1,850/MWh</span>
            <span>Water purification: ~₹0.55/L</span>
          </div>
        </motion.div>
      </div>

      {/* 4. Expandable "How Calculations Work" Section */}
      <motion.div 
        variants={cardVariants}
        className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] overflow-hidden shadow-2xs transition-colors"
      >
        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-[2px] bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">How Calculations Work</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Deterministic mathematical formulas for plant efficiency and unit costs
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 dark:text-slate-400">
            <span>{showHowItWorks ? 'Collapse' : 'Expand Details'}</span>
            {showHowItWorks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        <AnimatePresence>
          {showHowItWorks && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="border-t border-gray-100 dark:border-slate-800 p-4 sm:p-5 bg-gray-50/50 dark:bg-slate-900/30 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {formulas.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2px] space-y-2 shadow-2xs">
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">{item.name}</span>
                    <div className="bg-gray-50 dark:bg-slate-950 px-2.5 py-1.5 border border-gray-200 dark:border-slate-800 font-mono text-[11px] text-teal-800 dark:text-teal-300 rounded-[2px]">
                      {item.formula}
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-slate-400 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs rounded-[2px] flex items-center space-x-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
                <span>
                  All metrics in this simulation are computed strictly without third-party black-box algorithms, ensuring full reproducibility for academic evaluation.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </motion.div>
  );
}
