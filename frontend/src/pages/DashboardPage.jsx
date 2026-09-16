import React, { useState, useEffect } from 'react';
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
import KPICard from '../components/KPICard';
import AlertPanel from '../components/AlertPanel';
import ChartContainer from '../components/ChartContainer';
import ChartTooltip from '../components/ChartTooltip';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function DashboardPage({ refreshTrigger }) {
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboard(period);
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Unable to load dashboard data. Please ensure the backend server and MongoDB are active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [period, refreshTrigger]);

  if (loading && !data) {
    return <LoadingState message="Loading dashboard data..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboard} />;
  }

  const { kpis, chartData = [], alerts = [], recentReadings = [] } = data || {};

  return (
    <div className="space-y-6">
      
      {/* 1. Alerts Panel */}
      <AlertPanel alerts={alerts} />

      {/* 2. Four KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-semibold text-[#5C5C5C]">
            Daily production & cost indicators
          </h2>
          <span className="text-xs text-[#5C5C5C]">Current cycle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Hydrogen Produced */}
          <KPICard
            title="Hydrogen Produced"
            value={kpis?.hydrogenProduced?.value ?? 0}
            unit="kg/day"
            subText={kpis?.hydrogenProduced?.subText}
            status="normal"
          />

          {/* Card 2: Hydrogen Consumed */}
          <KPICard
            title="Hydrogen Consumed"
            value={kpis?.hydrogenConsumed?.value ?? 0}
            unit="kg/day"
            subText={kpis?.hydrogenConsumed?.subText}
            status="normal"
          />

          {/* Card 3: Production Efficiency */}
          <KPICard
            title="Production Efficiency"
            value={`${kpis?.productionEfficiency?.value ?? 0}%`}
            unit=""
            subText={kpis?.productionEfficiency?.subText}
            status={(kpis?.productionEfficiency?.value ?? 100) >= 90 ? 'normal' : 'warning'}
          />

          {/* Card 4: Operational Cost */}
          <KPICard
            title="Operational Cost"
            value={formatCurrency(kpis?.operationalCost?.value ?? 0)}
            unit=""
            subText={kpis?.operationalCost?.subText}
            status="normal"
          />
        </div>
      </div>

      {/* 3. Hydrogen Produced vs Hydrogen Consumed Chart */}
      <ChartContainer
        title="Daily Production Overview"
        description="Daily comparison between hydrogen produced and consumed (kg/day)"
        period={period}
        onPeriodChange={setPeriod}
      >
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                dataKey="hydrogenProduced" 
                name="Hydrogen Produced (kg)" 
                fill="#16a34a" 
                radius={[0, 0, 0, 0]} 
                maxBarSize={36}
              />
              <Line 
                type="monotone" 
                dataKey="hydrogenConsumed" 
                name="Hydrogen Consumed (kg)" 
                stroke="#111111" 
                strokeWidth={2} 
                dot={{ r: 2.5, fill: '#111111' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {/* 4. Recent Daily Readings Table */}
      <div className="bg-white border border-[#D1D1D1] rounded-[2px] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
          <div>
            <h3 className="text-sm font-semibold text-[#111111]">Recent Daily Readings</h3>
            <p className="text-xs text-[#5C5C5C] mt-0.5">Chronological record of plant daily performance</p>
          </div>
          <span className="text-xs text-[#5C5C5C] border border-[#D1D1D1] px-2 py-0.5 rounded-[2px]">
            {recentReadings.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#111111] border-collapse">
            <thead>
              <tr className="border-b border-[#D1D1D1] text-[#5C5C5C] font-medium bg-[#FAFAFA]">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3 text-right">Produced</th>
                <th className="py-2 px-3 text-right">Consumed</th>
                <th className="py-2 px-3 text-right">Efficiency</th>
                <th className="py-2 px-3 text-right">Total Cost</th>
                <th className="py-2 px-3 text-right">Cost / kg</th>
                <th className="py-2 px-3 text-right">Renewable %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {recentReadings.map((row) => (
                <tr key={row._id} className="hover:bg-[#F9F9F9] transition-colors">
                  <td className="py-2.5 px-3 font-medium text-[#111111]">{row.date}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-emerald-700">{row.hydrogenProduced} kg</td>
                  <td className="py-2.5 px-3 text-right text-[#5C5C5C]">{row.hydrogenConsumed} kg</td>
                  <td className={`py-2.5 px-3 text-right font-medium ${row.efficiency >= 90 ? 'text-[#111111]' : 'text-amber-600'}`}>
                    {row.efficiency}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#111111]">
                    {formatCurrency(row.operationalCost)}
                  </td>
                  <td className={`py-2.5 px-3 text-right ${row.costPerKg <= 150 ? 'text-[#111111]' : 'text-amber-600 font-medium'}`}>
                    ₹{row.costPerKg}
                  </td>
                  <td className={`py-2.5 px-3 text-right ${row.renewableEnergyPct >= 60 ? 'text-[#111111]' : 'text-amber-600 font-medium'}`}>
                    {row.renewableEnergyPct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
