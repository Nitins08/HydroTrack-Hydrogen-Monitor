import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { api } from '../services/api';
import { 
  Leaf, 
  Droplet, 
  Wind, 
  CloudRain, 
  ShieldCheck, 
  Info, 
  Sparkles,
  Award
} from 'lucide-react';
import KPICard from '../components/KPICard';
import ChartContainer from '../components/ChartContainer';
import ChartTooltip from '../components/ChartTooltip';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { SkeletonKPIGrid, SkeletonChart } from '../components/SkeletonLoader';
import AnimatedCounter from '../components/AnimatedCounter';
import { useTheme } from '../context/ThemeContext';
import { pageVariants, staggerContainer, cardVariants } from '../utils/animations';

export default function SustainabilityPage({ refreshTrigger }) {
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSustainability = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSustainability(period);
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sustainability metrics from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSustainability();
  }, [period, refreshTrigger]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200/70 animate-pulse rounded-[3px] w-64" />
        <SkeletonKPIGrid count={3} />
        <SkeletonChart />
      </div>
    );
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={fetchSustainability} />;
  }

  const { summary = {}, scoreBreakdown = {}, chartData = [] } = data || {};
  const pillars = scoreBreakdown.pillars || [];
  const totalScore = scoreBreakdown.totalScore ?? 85;

  // Circular gauge calculations (radius = 54, circumference = 2 * PI * 54 = ~339.29)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* 1. Page Header with Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#E5E2DA] dark:border-[#2C333A]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#171A1C] dark:text-[#F7F5F0] tracking-tight">
              Sustainability & Environmental Performance
            </h1>
            <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-[2px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[10px] font-semibold font-mono">
              <Leaf className="w-2.5 h-2.5" />
              <span>ESG Tier 1</span>
            </span>
          </div>
          <p className="text-xs text-[#606870] dark:text-[#8E97A0] mt-0.5">
            Decarbonization intensity, renewable electricity proportion, and water stewardship
          </p>
        </div>

        <div className="flex items-center space-x-1 self-start sm:self-auto bg-[#F8F7F4] dark:bg-[#131618] p-0.5 border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px]">
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'all', label: 'All Data' },
          ].map((tab) => {
            const isActive = period === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={shouldReduceMotion ? {} : { y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => setPeriod(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-[2px] transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-[#606870] dark:text-[#8E97A0] hover:text-[#171A1C] dark:hover:text-[#F7F5F0] hover:bg-white dark:hover:bg-[#1D2226]'
                }`}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. Three Concise Pillar Metric Cards with Educational Helper Text */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Metric 1: Renewable Energy % */}
        <motion.div
          variants={cardVariants}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] border-l-[3px] border-l-amber-500 rounded-[3px] p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#606870] dark:text-[#8E97A0] uppercase tracking-wide">
                Renewable Energy Share
              </span>
              <div className="w-7 h-7 rounded-[2px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Wind className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="my-2.5 flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-mono text-[#171A1C] dark:text-[#F7F5F0]">
                <AnimatedCounter value={summary.renewablePercentage ?? 0} decimals={1} />
              </span>
              <span className="text-xs text-[#606870] dark:text-[#8E97A0] font-semibold">%</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold ml-2 font-mono">
                Target ≥60%
              </span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#ECE9E2] dark:border-[#252B30] text-[11px] text-[#606870] dark:text-[#8E97A0] leading-relaxed">
            <strong className="text-[#171A1C] dark:text-[#F7F5F0]">Why it matters:</strong> Green hydrogen qualifies only when electrolysis is powered by non-fossil renewable electricity (solar, wind, hydro).
          </div>
        </motion.div>

        {/* Metric 2: CO2 per kg H2 */}
        <motion.div
          variants={cardVariants}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] border-l-[3px] border-l-amber-500 rounded-[3px] p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#606870] dark:text-[#8E97A0] uppercase tracking-wide">
                Carbon Intensity
              </span>
              <div className="w-7 h-7 rounded-[2px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Leaf className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="my-2.5 flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-mono text-[#171A1C] dark:text-[#F7F5F0]">
                <AnimatedCounter value={summary.co2PerKg ?? 0} decimals={2} />
              </span>
              <span className="text-xs text-[#606870] dark:text-[#8E97A0] font-semibold">kg CO₂ / kg H₂</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold ml-2 font-mono">
                Limit ≤0.8
              </span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#ECE9E2] dark:border-[#252B30] text-[11px] text-[#606870] dark:text-[#8E97A0] leading-relaxed">
            <strong className="text-[#171A1C] dark:text-[#F7F5F0]">Why it matters:</strong> Minimizing indirect grid emissions ensures the facility achieves true net-zero lifecycle carbon intensity.
          </div>
        </motion.div>

        {/* Metric 3: Water per kg H2 */}
        <motion.div
          variants={cardVariants}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] border-l-[3px] border-l-amber-500 rounded-[3px] p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#606870] dark:text-[#8E97A0] uppercase tracking-wide">
                Water Stewardship
              </span>
              <div className="w-7 h-7 rounded-[2px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <CloudRain className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="my-2.5 flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-mono text-[#171A1C] dark:text-[#F7F5F0]">
                <AnimatedCounter value={summary.waterPerKg ?? 0} decimals={1} />
              </span>
              <span className="text-xs text-[#606870] dark:text-[#8E97A0] font-semibold">Liters / kg H₂</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold ml-2 font-mono">
                Standard ~9 L
              </span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#ECE9E2] dark:border-[#252B30] text-[11px] text-[#606870] dark:text-[#8E97A0] leading-relaxed">
            <strong className="text-[#171A1C] dark:text-[#F7F5F0]">Why it matters:</strong> Stoichiometric splitting requires 9 kg of pure demineralized water per kg of H₂, plus auxiliary cooling allowances.
          </div>
        </motion.div>
      </motion.div>

      {/* 3. Circular Sustainability Score Gauge & 4-Pillar Breakdown */}
      <motion.div 
        variants={cardVariants}
        className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px] p-5 sm:p-6 space-y-6 shadow-2xs hover:border-gray-300 dark:hover:border-neutral-700 transition-colors"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-5 border-b border-[#ECE9E2] dark:border-[#252B30]">
          
          {/* Left: Gauge Circle */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={isDark ? '#252B30' : '#ECE9E2'}
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Animated Score Progress Ring */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#F5A623"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  initial={shouldReduceMotion ? { strokeDashoffset } : { strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.0, ease: 'easeOut' }}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Centered Score Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-mono text-[#171A1C] dark:text-[#F7F5F0] leading-none">
                  <AnimatedCounter value={totalScore} decimals={0} />
                </span>
                <span className="text-[10px] font-semibold text-[#606870] dark:text-[#8E97A0] mt-1 uppercase">/ 100 PTS</span>
              </div>
            </div>

            {/* Gauge Context Details */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-[2px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase font-mono">
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Eco-Certified Green Standard</span>
              </div>
              <h2 className="text-base font-bold text-[#171A1C] dark:text-[#F7F5F0]">
                Overall Sustainability Score
              </h2>
              <p className="text-xs text-[#606870] dark:text-[#8E97A0] max-w-md leading-relaxed">
                Aggregated deterministic ESG rating evaluated across renewable electricity share (40 pts), carbon emissions intensity (30 pts), water ratio (15 pts), and plant yield (15 pts).
              </p>
            </div>
          </div>

          {/* Right Summary Pill */}
          <div className="w-full lg:w-auto p-3.5 bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[2px] text-xs space-y-1 font-mono text-right hidden sm:block">
            <span className="text-[#606870] dark:text-[#8E97A0] block text-[11px]">Cumulative CO₂ Avoided</span>
            <span className="text-base font-bold text-amber-500 block">
              ~{Math.round((summary.totalHydrogenProduced ?? 1000) * 8.5).toLocaleString()} kg CO₂
            </span>
            <span className="text-[10px] text-[#606870] dark:text-[#8E97A0] block">Compared to fossil steam methane reforming</span>
          </div>
        </div>

        {/* 4 Pillars Grid with Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, idx) => {
            const pct = Math.min((pillar.points / pillar.maxPoints) * 100, 100);

            return (
              <div 
                key={idx} 
                className="p-3.5 bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[2px] space-y-2 hover:border-gray-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171A1C] dark:text-[#F7F5F0]">{pillar.title}</span>
                  <span className="text-xs font-mono font-bold text-amber-500">
                    {pillar.points} / {pillar.maxPoints} pts
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-[#ECE9E2] dark:bg-[#252B30] h-2 rounded-[2px] overflow-hidden border border-[#E5E2DA] dark:border-[#2C333A]">
                  <motion.div
                    initial={shouldReduceMotion ? { width: `${pct}%` } : { width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                    className="h-full bg-amber-500"
                  />
                </div>

                <div className="text-[11px] text-[#606870] dark:text-[#8E97A0] font-mono">
                  Current: <strong className="text-[#171A1C] dark:text-[#F7F5F0]">{pillar.currentMetric}</strong>
                </div>

                <p className="text-[11px] text-[#606870] dark:text-[#8E97A0] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-[11px] text-[#606870] dark:text-[#8E97A0] font-mono border-t border-[#ECE9E2] dark:border-[#252B30] flex items-center justify-between flex-wrap gap-2">
          <span>Project-specific evaluation model calibrated for academic viva demonstration.</span>
          <span className="text-amber-500 font-semibold">Simulated Operational Data</span>
        </div>
      </motion.div>

      {/* 4. Renewable Energy Share Over Time Area Chart */}
      <ChartContainer
        title="Renewable Energy Share Over Time"
        description="Daily percentage of total plant energy drawn from zero-emission renewable sources"
        hasData={chartData.length > 0}
        emptyTitle="No renewable energy telemetry logged"
        emptyDescription="There are no data points available for the selected cycle."
      >
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={isDark ? '#2C333A' : '#ECE9E2'} vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke={isDark ? '#8E97A0' : '#606870'} 
                tick={{ fill: isDark ? '#8E97A0' : '#606870', fontSize: 11 }} 
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke={isDark ? '#8E97A0' : '#606870'} 
                tick={{ fill: isDark ? '#8E97A0' : '#606870', fontSize: 11 }} 
                tickLine={false}
              />
              <Tooltip 
                isAnimationActive={false}
                animationDuration={0}
                animationEasing="linear"
                cursor={{ stroke: isDark ? '#8E97A0' : '#606870', strokeWidth: 1, strokeDasharray: '2 2' }}
                content={<ChartTooltip unit="%" />}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', color: isDark ? '#F7F5F0' : '#171A1C' }} />
              <Area 
                type="monotone" 
                dataKey="renewablePercentage" 
                name="Renewable Share (%)" 
                stroke="#F5A623" 
                strokeWidth={2} 
                fill={isDark ? '#D97706' : '#F5A623'} 
                fillOpacity={isDark ? 0.3 : 0.15} 
                isAnimationActive={!shouldReduceMotion}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

    </motion.div>
  );
}
