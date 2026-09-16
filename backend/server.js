import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import readingsRoutes from './routes/readingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import sustainabilityRoutes from './routes/sustainabilityRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Root health check
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'HydroTrack: Hydrogen Production, Cost and Sustainability Monitoring System',
    stack: 'MERN (MongoDB, Express.js, React.js, Node.js)',
    status: 'online',
    version: '1.0.0',
    endpoints: [
      '/api/readings',
      '/api/dashboard',
      '/api/analytics',
      '/api/sustainability'
    ]
  });
});

// API Routes
app.use('/api/readings', readingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sustainability', sustainabilityRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[HydroTrack Server]: Running on port ${PORT} (http://localhost:${PORT})`);
});
