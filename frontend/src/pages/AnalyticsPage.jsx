import React, { useState, useEffect } from 'react';
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
import KPICard from '../components/KPICard';
import ChartContainer from '../components/ChartContainer';
import ChartTooltip from '../components/ChartTooltip';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function AnalyticsPage({ refreshTrigger }) {
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAnalytics(period);
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period, refreshTrigger]);

  if (loading && !data) {
    return <LoadingState message="Loading analytics data..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAnalytics} />;
  }

  const { summary = {}, targetVsActualChart = [], formulas = [], costBreakdown = [] } = data || {};

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Summary Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h2 className="text-sm font-semibold text-[#111111]">
              Production & Energy Analytics
            </h2>
            <p className="text-xs text-[#5C5C5C] mt-0.5">
              Production yield, energy consumption, and operating cost metrics
            </p>
          </div>
          <span className="text-xs text-[#5C5C5C] border border-[#D1D1D1] px-2.5 py-0.5 rounded-[2px]">
            Period: {period.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Produced */}
          <KPICard
            title="Total Hydrogen Produced"
            value={summary.totalHydrogenProduced ?? 0}
            unit="kg"
            subText={`Period sum (${summary.daysCount} days)`}
            status="normal"
          />

          {/* Average Daily Production */}
          <KPICard
            title="Avg Daily Production"
            value={summary.averageDailyProduction ?? 0}
            unit="kg/day"
            subText="Target: 1,350 kg/day"
            status="normal"
          />

          {/* Production Efficiency */}
          <KPICard
            title="Production Efficiency"
            value={`${summary.productionEfficiency ?? 0}%`}
            unit=""
            subText="Actual vs Target output"
            status={(summary.productionEfficiency ?? 100) >= 90 ? 'normal' : 'warning'}
          />

          {/* Total Energy Consumed */}
          <KPICard
            title="Total Energy Consumed"
            value={summary.totalEnergyConsumed ?? 0}
            unit="MWh"
            subText="Electrolyzer power input"
            status="normal"
          />

          {/* Energy Efficiency */}
          <KPICard
            title="Energy Efficiency"
            value={summary.energyEfficiency ?? 0}
            unit="kg/MWh"
            subText={`Cost: ₹${summary.costPerKg ?? 0}/kg`}
            status="normal"
          />
        </div>
      </div>

      {/* 2. Target Production vs Actual Production Chart */}
      <ChartContainer
        title="Target vs Actual Production"
        description="Daily hydrogen output compared against target baseline (kg/day)"
        period={period}
        onPeriodChange={setPeriod}
      >
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={targetVsActualChart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#E5E5E5" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#5C5C5C" 
                tick={{ fill: '#5C5C5C', fontSize: 11 }} 
                tickLine={false}
              />
              <YAxis 
                stroke="#5C5C5C" 
                domain={['auto', 'auto']} 
                tick={{ fill: '#5C5C5C', fontSize: 11 }} 
                tickLine={false}
              />
              <Tooltip 
                isAnimationActive={false}
                animationDuration={0}
                animationEasing="linear"
                cursor={{ fill: '#F5F5F5', opacity: 0.8 }}
                content={<ChartTooltip />}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar 
                dataKey="actualProduction" 
                name="Actual Production (kg)" 
                fill="#16a34a" 
                radius={[0, 0, 0, 0]} 
                maxBarSize={36}
              />
              <Line 
                type="monotone" 
                dataKey="targetProduction" 
                name="Target Benchmark (kg)" 
                stroke="#111111" 
                strokeWidth={1.5} 
                strokeDasharray="3 3" 
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {/* 3. Cost Breakdown & Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white border border-[#D1D1D1] rounded-[2px] p-4 sm:p-5 space-y-3">
          <h3 className="text-sm font-semibold text-[#111111]">
            Operational Cost Breakdown
          </h3>
          <p className="text-xs text-[#5C5C5C]">
            Total cost: <strong className="text-[#111111]">{formatCurrency(summary.totalOperationalCost ?? 0)}</strong>
          </p>

          <div className="space-y-3 pt-2">
            {costBreakdown.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5C5C5C]">{item.name}</span>
                  <span className="text-[#111111] font-medium">
                    {formatCurrency(item.amount)} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#F5F5F5] h-1.5 border border-[#D1D1D1]">
                  <div 
                    className="h-full bg-[#111111]" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs text-[#5C5C5C] flex justify-between">
            <span>Average cost per kg:</span>
            <strong className="text-[#111111]">₹{summary.costPerKg ?? 0} / kg H₂</strong>
          </div>
        </div>

        {/* 4. Calculation Methodology */}
        <div className="lg:col-span-2 bg-white border border-[#D1D1D1] rounded-[2px] p-4 sm:p-5 space-y-3">
          <div className="pb-2 border-b border-[#E5E5E5]">
            <h3 className="text-sm font-semibold text-[#111111]">Calculation Methodology</h3>
            <p className="text-xs text-[#5C5C5C] mt-0.5">Formulas used for plant performance and unit cost metrics</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formulas.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#F9F9F9] border border-[#D1D1D1] rounded-[2px] space-y-1.5">
                <span className="text-xs font-semibold text-[#111111]">{item.name}</span>
                <div className="bg-white px-2 py-1 border border-[#D1D1D1] font-mono text-[11px] text-[#111111]">
                  {item.formula}
                </div>
                <p className="text-[11px] text-[#5C5C5C] leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-[#5C5C5C]">
            Note: All calculations are derived deterministically from daily readings recorded in the database.
          </div>
        </div>
      </div>

    </div>
  );
}
