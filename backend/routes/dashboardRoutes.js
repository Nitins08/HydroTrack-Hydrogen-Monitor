import express from 'express';
import { getDashboardData } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getDashboardData);

export default router;
