import express from 'express';
import { getSustainabilityData } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSustainabilityData);

export default router;
