import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DailyReading from '../models/DailyReading.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hydrotrack';

const generateSeedData = (daysCount = 30) => {
  const readings = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setUTCHours(0, 0, 0, 0);

    // Realistic industrial values with small variations
    const dayFactor = Math.sin(i * 0.4) * 50; // smooth cyclical variance
    const target = 1350; // rated plant capacity (kg/day)
    
    // Occasional derate day to demonstrate alerts in a college demo
    const isMaintenanceDay = i === 4;
    const isLowRenewableDay = i === 11;

    let produced = Math.round((1320 + dayFactor + (Math.random() * 60 - 30)) * 10) / 10;
    if (isMaintenanceDay) {
      produced = 1150.0; // efficiency ~85% -> triggers low efficiency warning
    }

    const consumed = Math.round((produced * (0.95 + Math.random() * 0.03)) * 10) / 10;
    const energyConsumed = Math.round((produced * 0.052 + (Math.random() * 2 - 1)) * 100) / 100; // ~52 kWh/kg = 0.052 MWh/kg

    let renewableEnergy = Math.round((energyConsumed * (0.75 + Math.random() * 0.15)) * 100) / 100;
    if (isLowRenewableDay) {
      renewableEnergy = Math.round((energyConsumed * 0.54) * 100) / 100; // 54% -> triggers renewable alert
    }
    renewableEnergy = Math.min(energyConsumed, renewableEnergy);

    // Water: stoichiometric is ~9 L/kg + cooling ~1.5 L/kg = ~10.5 L/kg
    const waterConsumed = Math.round(produced * (9.5 + Math.random() * 1.5));

    // Costs in INR (₹)
    // Electricity tariff ~ ₹1,800/MWh
    const electricityCost = Math.round(energyConsumed * 1850 + (Math.random() * 3000 - 1500));
    // Water ~ ₹0.50/L
    const waterCost = Math.round(waterConsumed * 0.55);
    // Maintenance: regular ₹15k-₹20k, higher on maintenance day
    let maintenanceCost = Math.round(16000 + (Math.random() * 5000 - 2500));
    if (isMaintenanceDay) {
      maintenanceCost = 65000; // raises cost per kg -> triggers cost alert
    }

    // CO2 emissions from non-renewable grid fraction (grid factor ~ 0.45 kg CO2/kWh = 450 kg/MWh)
    const nonRenewableEnergy = energyConsumed - renewableEnergy;
    const co2Emissions = Math.round(nonRenewableEnergy * 460 + (Math.random() * 50 - 25));

    readings.push({
      date: d,
      hydrogenProduced: produced,
      hydrogenConsumed: consumed,
      targetProduction: target,
      energyConsumed,
      renewableEnergy,
      waterConsumed,
      electricityCost,
      waterCost,
      maintenanceCost,
      co2Emissions
    });
  }

  return readings;
};

const seedDatabase = async () => {
  try {
    console.log(`[Seed Script]: Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('[Seed Script]: Connected successfully.');

    // Clear existing readings to ensure clean deterministic demo dataset
    console.log('[Seed Script]: Clearing old dailyreadings records...');
    await DailyReading.deleteMany({});

    // Generate 30 days of data
    const sampleReadings = generateSeedData(30);
    console.log(`[Seed Script]: Inserting ${sampleReadings.length} realistic daily readings...`);
    await DailyReading.insertMany(sampleReadings);

    console.log('----------------------------------------------------');
    console.log(' [SUCCESS]: 30 Days of realistic sample data seeded!');
    console.log(' Database: hydrotrack | Collection: dailyreadings');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]:', error.message);
    process.exit(1);
  }
};

seedDatabase();
