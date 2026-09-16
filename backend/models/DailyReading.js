import mongoose from 'mongoose';

const dailyReadingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Reading date is required'],
      unique: true,
      index: true
    },
    hydrogenProduced: {
      type: Number,
      required: [true, 'Hydrogen produced (kg) is required'],
      min: [0, 'Hydrogen produced cannot be negative']
    },
    hydrogenConsumed: {
      type: Number,
      required: [true, 'Hydrogen consumed (kg) is required'],
      min: [0, 'Hydrogen consumed cannot be negative']
    },
    targetProduction: {
      type: Number,
      required: [true, 'Target production benchmark (kg) is required'],
      min: [0, 'Target production cannot be negative']
    },
    energyConsumed: {
      type: Number,
      required: [true, 'Energy consumed (kWh or MWh) is required'],
      min: [0, 'Energy consumed cannot be negative']
    },
    renewableEnergy: {
      type: Number,
      required: [true, 'Renewable energy consumed is required'],
      min: [0, 'Renewable energy cannot be negative']
    },
    waterConsumed: {
      type: Number,
      required: [true, 'Water consumed (L) is required'],
      min: [0, 'Water consumed cannot be negative']
    },
    electricityCost: {
      type: Number,
      required: [true, 'Electricity cost (₹) is required'],
      min: [0, 'Electricity cost cannot be negative']
    },
    waterCost: {
      type: Number,
      required: [true, 'Water cost (₹) is required'],
      min: [0, 'Water cost cannot be negative']
    },
    maintenanceCost: {
      type: Number,
      required: [true, 'Maintenance cost (₹) is required'],
      min: [0, 'Maintenance cost cannot be negative']
    },
    co2Emissions: {
      type: Number,
      required: [true, 'CO2 emissions (kg) is required'],
      min: [0, 'CO2 emissions cannot be negative']
    }
  },
  {
    timestamps: true,
    collection: 'dailyreadings'
  }
);

const DailyReading = mongoose.model('DailyReading', dailyReadingSchema);

export default DailyReading;
