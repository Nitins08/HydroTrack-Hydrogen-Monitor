import { getFilteredReadings } from './readingsController.js';

// @desc    Get dashboard metrics, 4 KPIs, chart series, alerts, and recent readings
// @route   GET /api/dashboard?period=7d|30d|all
export const getDashboardData = async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const readings = await getFilteredReadings(period);

    if (!readings || readings.length === 0) {
      return res.status(200).json({
        success: true,
        period,
        kpis: null,
        chartData: [],
        alerts: [],
        recentReadings: []
      });
    }

    const latest = readings[readings.length - 1];

    // Calculations for the latest day / period
    const latestProduced = latest.hydrogenProduced;
    const latestConsumed = latest.hydrogenConsumed;
    const latestTarget = latest.targetProduction;
    const latestEfficiency = latestTarget > 0 ? (latestProduced / latestTarget) * 100 : 0;
    const latestCost = latest.electricityCost + latest.waterCost + latest.maintenanceCost;
    const latestCostPerKg = latestProduced > 0 ? latestCost / latestProduced : 0;
    const latestRenewablePct = latest.energyConsumed > 0 ? (latest.renewableEnergy / latest.energyConsumed) * 100 : 0;

    // Period totals
    const totalProduced = readings.reduce((acc, r) => acc + r.hydrogenProduced, 0);
    const totalConsumed = readings.reduce((acc, r) => acc + r.hydrogenConsumed, 0);
    const totalTarget = readings.reduce((acc, r) => acc + r.targetProduction, 0);
    const totalCost = readings.reduce(
      (acc, r) => acc + r.electricityCost + r.waterCost + r.maintenanceCost,
      0
    );
    const averageDailyProduced = totalProduced / readings.length;
    const periodEfficiency = totalTarget > 0 ? (totalProduced / totalTarget) * 100 : 0;
    const periodCostPerKg = totalProduced > 0 ? totalCost / totalProduced : 0;

    // 4 Main KPI Cards
    const kpis = {
      hydrogenProduced: {
        id: 'hydrogen_produced',
        title: 'Hydrogen Produced',
        value: Number(latestProduced.toFixed(1)),
        unit: 'kg/day',
        subText: `Period Average: ${averageDailyProduced.toFixed(1)} kg/day`,
        periodTotal: Number(totalProduced.toFixed(1))
      },
      hydrogenConsumed: {
        id: 'hydrogen_consumed',
        title: 'Hydrogen Consumed',
        value: Number(latestConsumed.toFixed(1)),
        unit: 'kg/day',
        subText: `Period Total: ${totalConsumed.toLocaleString()} kg`,
        periodTotal: Number(totalConsumed.toFixed(1))
      },
      productionEfficiency: {
        id: 'production_efficiency',
        title: 'Production Efficiency',
        value: Number(latestEfficiency.toFixed(1)),
        unit: '%',
        subText: `Benchmark Target: 100% (Period: ${periodEfficiency.toFixed(1)}%)`,
        status: latestEfficiency >= 90 ? 'normal' : 'warning'
      },
      operationalCost: {
        id: 'operational_cost',
        title: 'Operational Cost',
        value: Math.round(latestCost),
        unit: '₹/day',
        subText: `Unit Cost: ₹${latestCostPerKg.toFixed(2)}/kg`,
        costPerKg: Number(latestCostPerKg.toFixed(2))
      }
    };

    // Chart Data: Produced vs Consumed for selected period
    const chartData = readings.map((r) => {
      const dateStr = new Date(r.date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      });
      const dayCost = r.electricityCost + r.waterCost + r.maintenanceCost;
      const dayCostPerKg = r.hydrogenProduced > 0 ? dayCost / r.hydrogenProduced : 0;
      const eff = r.targetProduction > 0 ? (r.hydrogenProduced / r.targetProduction) * 100 : 0;
      const renPct = r.energyConsumed > 0 ? (r.renewableEnergy / r.energyConsumed) * 100 : 0;

      return {
        date: dateStr,
        fullDate: new Date(r.date).toISOString().slice(0, 10),
        hydrogenProduced: Number(r.hydrogenProduced.toFixed(1)),
        hydrogenConsumed: Number(r.hydrogenConsumed.toFixed(1)),
        targetProduction: Number(r.targetProduction.toFixed(1)),
        efficiency: Number(eff.toFixed(1)),
        costPerKg: Number(dayCostPerKg.toFixed(2)),
        renewableShare: Number(renPct.toFixed(1))
      };
    });

    // Generate Alerts strictly using the 3 specified rules:
    // 1. Production efficiency below 90%: warning
    // 2. Cost per kg of hydrogen above ₹150: warning
    // 3. Renewable energy share below 60%: warning
    const alerts = [];

    if (latestEfficiency < 90) {
      alerts.push({
        id: 'alert-efficiency-low',
        type: 'warning',
        title: 'Low Production Efficiency',
        message: `Current production efficiency is ${latestEfficiency.toFixed(1)}%, which is below the 90% benchmark.`,
        currentValue: `${latestEfficiency.toFixed(1)}%`,
        threshold: '≥ 90%'
      });
    }

    if (latestCostPerKg > 150) {
      alerts.push({
        id: 'alert-cost-high',
        type: 'warning',
        title: 'High Cost per kg',
        message: `Unit production cost is ₹${latestCostPerKg.toFixed(2)}/kg, exceeding the ₹150/kg threshold.`,
        currentValue: `₹${latestCostPerKg.toFixed(2)}/kg`,
        threshold: '≤ ₹150/kg'
      });
    }

    if (latestRenewablePct < 60) {
      alerts.push({
        id: 'alert-renewable-low',
        type: 'warning',
        title: 'Low Renewable Energy Share',
        message: `Renewable energy share dropped to ${latestRenewablePct.toFixed(1)}%, which is below the 60% threshold.`,
        currentValue: `${latestRenewablePct.toFixed(1)}%`,
        threshold: '≥ 60%'
      });
    }

    // Recent daily readings table (latest 10 entries in descending order)
    const recentReadings = [...readings].reverse().slice(0, 10).map((r) => {
      const dayCost = r.electricityCost + r.waterCost + r.maintenanceCost;
      const dayCostPerKg = r.hydrogenProduced > 0 ? dayCost / r.hydrogenProduced : 0;
      const eff = r.targetProduction > 0 ? (r.hydrogenProduced / r.targetProduction) * 100 : 0;
      const renPct = r.energyConsumed > 0 ? (r.renewableEnergy / r.energyConsumed) * 100 : 0;

      return {
        _id: r._id,
        date: new Date(r.date).toISOString().slice(0, 10),
        hydrogenProduced: r.hydrogenProduced,
        hydrogenConsumed: r.hydrogenConsumed,
        targetProduction: r.targetProduction,
        energyConsumed: r.energyConsumed,
        renewableEnergy: r.renewableEnergy,
        waterConsumed: r.waterConsumed,
        electricityCost: r.electricityCost,
        waterCost: r.waterCost,
        maintenanceCost: r.maintenanceCost,
        co2Emissions: r.co2Emissions,
        efficiency: Number(eff.toFixed(1)),
        operationalCost: Math.round(dayCost),
        costPerKg: Number(dayCostPerKg.toFixed(2)),
        renewableEnergyPct: Number(renPct.toFixed(1))
      };
    });

    res.status(200).json({
      success: true,
      period,
      kpis,
      chartData,
      alerts,
      recentReadings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate dashboard data',
      error: error.message
    });
  }
};

// @desc    Get analytics metrics, target vs actual chart, efficiency, cost breakdowns
// @route   GET /api/analytics?period=7d|30d|all
export const getAnalyticsData = async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const readings = await getFilteredReadings(period);

    if (!readings || readings.length === 0) {
      return res.status(200).json({
        success: true,
        period,
        summary: null,
        targetVsActualChart: [],
        costBreakdown: []
      });
    }

    // Aggregations
    const totalProduced = readings.reduce((sum, r) => sum + r.hydrogenProduced, 0);
    const totalTarget = readings.reduce((sum, r) => sum + r.targetProduction, 0);
    const totalEnergy = readings.reduce((sum, r) => sum + r.energyConsumed, 0);
    const totalElectricityCost = readings.reduce((sum, r) => sum + r.electricityCost, 0);
    const totalWaterCost = readings.reduce((sum, r) => sum + r.waterCost, 0);
    const totalMaintenanceCost = readings.reduce((sum, r) => sum + r.maintenanceCost, 0);
    const totalOperationalCost = totalElectricityCost + totalWaterCost + totalMaintenanceCost;

    const averageDailyProduction = totalProduced / readings.length;
    // Production Efficiency = (Actual Production / Target Production) × 100
    const productionEfficiency = totalTarget > 0 ? (totalProduced / totalTarget) * 100 : 0;
    // Energy Efficiency = Hydrogen Produced / Energy Consumed
    const energyEfficiency = totalEnergy > 0 ? totalProduced / totalEnergy : 0;
    // Cost per kg of Hydrogen = Total Operational Cost / Hydrogen Produced
    const costPerKg = totalProduced > 0 ? totalOperationalCost / totalProduced : 0;

    // Target vs Actual Chart
    const targetVsActualChart = readings.map((r) => ({
      date: new Date(r.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      fullDate: new Date(r.date).toISOString().slice(0, 10),
      actualProduction: Number(r.hydrogenProduced.toFixed(1)),
      targetProduction: Number(r.targetProduction.toFixed(1)),
      variance: Number((r.hydrogenProduced - r.targetProduction).toFixed(1))
    }));

    // Cost Breakdown components
    const costBreakdown = [
      {
        name: 'Electricity Cost',
        amount: Math.round(totalElectricityCost),
        percentage: totalOperationalCost > 0 ? Number(((totalElectricityCost / totalOperationalCost) * 100).toFixed(1)) : 0
      },
      {
        name: 'Water Cost',
        amount: Math.round(totalWaterCost),
        percentage: totalOperationalCost > 0 ? Number(((totalWaterCost / totalOperationalCost) * 100).toFixed(1)) : 0
      },
      {
        name: 'Maintenance Cost',
        amount: Math.round(totalMaintenanceCost),
        percentage: totalOperationalCost > 0 ? Number(((totalMaintenanceCost / totalOperationalCost) * 100).toFixed(1)) : 0
      }
    ];

    res.status(200).json({
      success: true,
      period,
      summary: {
        totalHydrogenProduced: Number(totalProduced.toFixed(1)),
        averageDailyProduction: Number(averageDailyProduction.toFixed(1)),
        productionEfficiency: Number(productionEfficiency.toFixed(1)),
        totalEnergyConsumed: Number(totalEnergy.toFixed(1)),
        energyEfficiency: Number(energyEfficiency.toFixed(2)), // kg H2 / kWh or MWh
        totalOperationalCost: Math.round(totalOperationalCost),
        costPerKg: Number(costPerKg.toFixed(2)),
        daysCount: readings.length
      },
      targetVsActualChart,
      costBreakdown,
      formulas: [
        {
          name: 'Production Efficiency',
          formula: 'Production Efficiency = (Actual Production / Target Production) × 100',
          explanation: 'Calculates how closely actual electrolyzer output aligns with the planned baseline.'
        },
        {
          name: 'Energy Efficiency',
          formula: 'Energy Efficiency = Hydrogen Produced / Energy Consumed',
          explanation: 'Measures mass of hydrogen generated per unit of electric energy input.'
        },
        {
          name: 'Total Operational Cost',
          formula: 'Total Operational Cost = Electricity Cost + Water Cost + Maintenance Cost',
          explanation: 'Aggregates all daily direct inputs required for plant operation.'
        },
        {
          name: 'Cost per kg of Hydrogen',
          formula: 'Cost per kg = Total Operational Cost / Hydrogen Produced',
          explanation: 'Normalized unit economics indicating variable production expenditure per kilogram.'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate analytics data',
      error: error.message
    });
  }
};

// @desc    Get sustainability metrics and 100-point transparent score breakdown
// @route   GET /api/sustainability?period=7d|30d|all
export const getSustainabilityData = async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const readings = await getFilteredReadings(period);

    if (!readings || readings.length === 0) {
      return res.status(200).json({
        success: true,
        period,
        summary: null,
        scoreDetails: null,
        chartData: []
      });
    }

    const totalProduced = readings.reduce((sum, r) => sum + r.hydrogenProduced, 0);
    const totalTarget = readings.reduce((sum, r) => sum + r.targetProduction, 0);
    const totalEnergy = readings.reduce((sum, r) => sum + r.energyConsumed, 0);
    const totalRenewableEnergy = readings.reduce((sum, r) => sum + r.renewableEnergy, 0);
    const totalWater = readings.reduce((sum, r) => sum + r.waterConsumed, 0);
    const totalCo2 = readings.reduce((sum, r) => sum + r.co2Emissions, 0);

    // Core sustainability rates
    const renewablePercentage = totalEnergy > 0 ? (totalRenewableEnergy / totalEnergy) * 100 : 0;
    const co2PerKg = totalProduced > 0 ? totalCo2 / totalProduced : 0;
    const waterPerKg = totalProduced > 0 ? totalWater / totalProduced : 0;
    const productionEfficiency = totalTarget > 0 ? (totalProduced / totalTarget) * 100 : 0;

    // Transparent Sustainability Score Formula (100 Points Max):
    // 1. Renewable energy share: maximum 40 points
    //    Score = (Renewable% / 100) * 40
    const renewablePoints = Math.min(40, Math.max(0, (renewablePercentage / 100) * 40));

    // 2. Low CO2 emissions: maximum 30 points
    //    Ideal clean threshold: <= 0.5 kg CO2/kg H2 = 30 pts; >= 3.0 kg CO2/kg H2 = 0 pts
    let co2Points = 0;
    if (co2PerKg <= 0.5) {
      co2Points = 30;
    } else if (co2PerKg >= 3.0) {
      co2Points = 0;
    } else {
      co2Points = 30 * (1 - (co2PerKg - 0.5) / (3.0 - 0.5));
    }

    // 3. Efficient water use: maximum 15 points
    //    Stoichiometric minimum is ~9 L/kg H2. <= 10 L/kg = 15 pts; >= 25 L/kg = 0 pts
    let waterPoints = 0;
    if (waterPerKg <= 10) {
      waterPoints = 15;
    } else if (waterPerKg >= 25) {
      waterPoints = 0;
    } else {
      waterPoints = 15 * (1 - (waterPerKg - 10) / (25 - 10));
    }

    // 4. Production efficiency: maximum 15 points
    //    Efficiency >= 100% = 15 pts; < 70% = 0 pts; linear in between
    let efficiencyPoints = 0;
    if (productionEfficiency >= 100) {
      efficiencyPoints = 15;
    } else if (productionEfficiency <= 70) {
      efficiencyPoints = 0;
    } else {
      efficiencyPoints = 15 * ((productionEfficiency - 70) / (100 - 70));
    }

    const totalScore = Math.min(
      100,
      Math.max(0, Math.round(renewablePoints + co2Points + waterPoints + efficiencyPoints))
    );

    // Time-series for sustainability trends
    const chartData = readings.map((r) => {
      const renPct = r.energyConsumed > 0 ? (r.renewableEnergy / r.energyConsumed) * 100 : 0;
      const co2Kg = r.hydrogenProduced > 0 ? r.co2Emissions / r.hydrogenProduced : 0;
      const waterKg = r.hydrogenProduced > 0 ? r.waterConsumed / r.hydrogenProduced : 0;

      return {
        date: new Date(r.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        fullDate: new Date(r.date).toISOString().slice(0, 10),
        renewablePercentage: Number(renPct.toFixed(1)),
        co2PerKg: Number(co2Kg.toFixed(2)),
        waterPerKg: Number(waterKg.toFixed(1))
      };
    });

    res.status(200).json({
      success: true,
      period,
      summary: {
        totalCo2Emissions: Math.round(totalCo2),
        co2PerKg: Number(co2PerKg.toFixed(2)),
        renewablePercentage: Number(renewablePercentage.toFixed(1)),
        totalWaterConsumed: Math.round(totalWater),
        waterPerKg: Number(waterPerKg.toFixed(1)),
        sustainabilityScore: totalScore
      },
      scoreBreakdown: {
        totalScore,
        maxScore: 100,
        pillars: [
          {
            title: 'Renewable Energy Share',
            points: Number(renewablePoints.toFixed(1)),
            maxPoints: 40,
            description: 'Points awarded proportionally based on percentage of renewable power used.',
            currentMetric: `${renewablePercentage.toFixed(1)}% renewable`
          },
          {
            title: 'Low CO₂ Emissions',
            points: Number(co2Points.toFixed(1)),
            maxPoints: 30,
            description: 'Points awarded for low carbon intensity per kg of hydrogen produced.',
            currentMetric: `${co2PerKg.toFixed(2)} kg CO₂ / kg H₂`
          },
          {
            title: 'Efficient Water Use',
            points: Number(waterPoints.toFixed(1)),
            maxPoints: 15,
            description: 'Points awarded for minimizing water consumption close to stoichiometric limits.',
            currentMetric: `${waterPerKg.toFixed(1)} L water / kg H₂`
          },
          {
            title: 'Production Efficiency',
            points: Number(efficiencyPoints.toFixed(1)),
            maxPoints: 15,
            description: 'Points awarded for meeting or exceeding target operational capacity.',
            currentMetric: `${productionEfficiency.toFixed(1)}% efficiency`
          }
        ]
      },
      chartData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate sustainability data',
      error: error.message
    });
  }
};
