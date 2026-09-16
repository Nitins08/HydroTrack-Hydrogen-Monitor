import React, { useState, useEffect } from 'react';
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
import KPICard from '../components/KPICard';
import ChartContainer from '../components/ChartContainer';
import ChartTooltip from '../components/ChartTooltip';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function SustainabilityPage({ refreshTrigger }) {
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
      setError('Failed to fetch sustainability metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSustainability();
  }, [period, refreshTrigger]);

  if (loading && !data) {
    return <LoadingState message="Loading sustainability metrics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchSustainability} />;
  }

  const { summary = {}, scoreBreakdown = {}, chartData = [] } = data || {};
  const pillars = scoreBreakdown.pillars || [];

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Period Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#D1D1D1]">
        <div>
          <h2 className="text-sm font-semibold text-[#111111]">
            Sustainability & Environmental Performance
          </h2>
          <p className="text-xs text-[#5C5C5C] mt-0.5">
            Carbon emissions, renewable electricity proportion, and water usage efficiency
          </p>
        </div>

        <div className="flex items-center space-x-1 self-start sm:self-auto">
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'all', label: 'All Data' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id)}
              className={`px-3 py-1 text-xs font-medium border rounded-[2px] transition-colors ${
                period === tab.id
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-[#5C5C5C] border-[#D1D1D1] hover:text-[#111111] hover:border-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Core Metrics (5 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total CO2 */}
        <KPICard
          title="Total CO₂ Emissions"
          value={summary.totalCo2Emissions ?? 0}
          unit="kg CO₂"
          subText="Grid fossil backup draw"
          status="normal"
        />

        {/* CO2 per kg */}
        <KPICard
          title="CO₂ Intensity"
          value={summary.co2PerKg ?? 0}
          unit="kg CO₂/kg H₂"
          subText="Target: ≤ 0.8 kg CO₂/kg"
          status={(summary.co2PerKg ?? 0) <= 0.8 ? 'normal' : 'warning'}
        />

        {/* Renewable Energy % */}
        <KPICard
          title="Renewable Energy Share"
          value={`${summary.renewablePercentage ?? 0}%`}
          unit=""
          subText="Clean power proportion"
          status={(summary.renewablePercentage ?? 0) >= 60 ? 'normal' : 'warning'}
        />

        {/* Total Water */}
        <KPICard
          title="Total Water Consumed"
          value={summary.totalWaterConsumed ?? 0}
          unit="Liters"
          subText="Purified feedstock water"
          status="normal"
        />

        {/* Water per kg */}
        <KPICard
          title="Water Consumed per kg"
          value={summary.waterPerKg ?? 0}
          unit="L / kg H₂"
          subText="Stoichiometric standard ~9 L/kg"
          status="normal"
        />
      </div>

      {/* 3. 100-Point Sustainability Score Card */}
      <div className="bg-white border border-[#D1D1D1] rounded-[2px] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#E5E5E5]">
          <div>
            <h3 className="text-sm font-semibold text-[#111111]">
              Sustainability Score ({scoreBreakdown.totalScore ?? 0} / 100)
            </h3>
            <p className="text-xs text-[#5C5C5C] mt-0.5">
              Score calculated across renewable energy share, carbon emissions, water use, and plant efficiency
            </p>
          </div>

          <div className="px-3 py-1 bg-[#F9F9F9] border border-[#D1D1D1] rounded-[2px] text-center self-start sm:self-auto">
            <span className="text-[11px] text-[#5C5C5C] block">Overall Rating</span>
            <div className="text-xl font-bold text-[#111111]">
              {scoreBreakdown.totalScore ?? 0} <span className="text-xs font-normal text-[#5C5C5C]">/ 100</span>
            </div>
          </div>
        </div>

        {/* Score Pillars Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="p-3.5 bg-[#FAFAFA] border border-[#D1D1D1] rounded-[2px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#111111]">{pillar.title}</span>
                <span className="text-xs font-mono font-semibold text-[#111111]">
                  {pillar.points} / {pillar.maxPoints} pts
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#E5E5E5] h-1.5 border border-[#D1D1D1]">
                <div 
                  className="h-full bg-[#111111]"
                  style={{ width: `${(pillar.points / pillar.maxPoints) * 100}%` }}
                />
              </div>

              <div className="text-[11px] text-[#5C5C5C]">
                Current: <strong className="text-[#111111]">{pillar.currentMetric}</strong>
              </div>

              <p className="text-[11px] text-[#5C5C5C] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 text-[11px] text-[#5C5C5C]">
          Note: This 100-point sustainability score is intended for project evaluation and academic monitoring.
        </div>
      </div>

      {/* 4. Renewable Energy Share Over Time Chart */}
      <ChartContainer
        title="Renewable Energy Share Over Time"
        description="Daily percentage of electricity sourced from clean energy"
      >
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#E5E5E5" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#5C5C5C" 
                tick={{ fill: '#5C5C5C', fontSize: 11 }} 
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#5C5C5C" 
                tick={{ fill: '#5C5C5C', fontSize: 11 }} 
                tickLine={false}
              />
              <Tooltip 
                isAnimationActive={false}
                animationDuration={0}
                animationEasing="linear"
                cursor={{ stroke: '#5C5C5C', strokeWidth: 1, strokeDasharray: '2 2' }}
                content={<ChartTooltip unit="%" />}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Area 
                type="monotone" 
                dataKey="renewablePercentage" 
                name="Renewable Share (%)" 
                stroke="#16a34a" 
                strokeWidth={2} 
                fill="#16a34a" 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

    </div>
  );
}
