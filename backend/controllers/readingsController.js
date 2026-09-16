import DailyReading from '../models/DailyReading.js';

// Helper to filter readings by period query ('7d', '30d', 'all')
export const getFilteredReadings = async (period = '30d') => {
  const query = DailyReading.find().sort({ date: 1 });
  const allReadings = await query.exec();

  if (!allReadings || allReadings.length === 0) {
    return [];
  }

  if (period === '7d') {
    return allReadings.slice(-7);
  } else if (period === '30d') {
    return allReadings.slice(-30);
  }
  return allReadings;
};

// @desc    Get daily readings with optional period filter
// @route   GET /api/readings?period=7d|30d|all
export const getReadings = async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const readings = await getFilteredReadings(period);

    res.status(200).json({
      success: true,
      count: readings.length,
      period,
      data: readings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch readings',
      error: error.message
    });
  }
};

// @desc    Add a single daily reading
// @route   POST /api/readings
export const addReading = async (req, res) => {
  try {
    const {
      date,
      hydrogenProduced,
      hydrogenConsumed,
      targetProduction,
      energyConsumed,
      renewableEnergy,
      waterConsumed,
      electricityCost,
      waterCost,
      maintenanceCost,
      co2Emissions
    } = req.body;

    // Validate required fields
    if (
      !date ||
      hydrogenProduced === undefined ||
      hydrogenConsumed === undefined ||
      targetProduction === undefined ||
      energyConsumed === undefined ||
      renewableEnergy === undefined ||
      waterConsumed === undefined ||
      electricityCost === undefined ||
      waterCost === undefined ||
      maintenanceCost === undefined ||
      co2Emissions === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'All daily reading fields are required.'
      });
    }

    // Validate numeric values are non-negative
    const numericFields = {
      hydrogenProduced: Number(hydrogenProduced),
      hydrogenConsumed: Number(hydrogenConsumed),
      targetProduction: Number(targetProduction),
      energyConsumed: Number(energyConsumed),
      renewableEnergy: Number(renewableEnergy),
      waterConsumed: Number(waterConsumed),
      electricityCost: Number(electricityCost),
      waterCost: Number(waterCost),
      maintenanceCost: Number(maintenanceCost),
      co2Emissions: Number(co2Emissions)
    };

    for (const [key, val] of Object.entries(numericFields)) {
      if (isNaN(val) || val < 0) {
        return res.status(400).json({
          success: false,
          message: `Field '${key}' must be a valid non-negative number.`
        });
      }
    }

    if (numericFields.renewableEnergy > numericFields.energyConsumed) {
      return res.status(400).json({
        success: false,
        message: 'Renewable energy cannot exceed total energy consumed.'
      });
    }

    // Check if reading for date already exists
    const readingDate = new Date(date);
    readingDate.setUTCHours(0, 0, 0, 0);

    const existing = await DailyReading.findOne({
      date: {
        $gte: new Date(readingDate),
        $lt: new Date(readingDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A daily reading for date ${readingDate.toISOString().slice(0, 10)} already exists.`
      });
    }

    const newReading = await DailyReading.create({
      date: readingDate,
      ...numericFields
    });

    res.status(201).json({
      success: true,
      message: 'Daily reading successfully recorded.',
      data: newReading
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Could not create daily reading',
      error: error.message
    });
  }
};
