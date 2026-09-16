import express from 'express';
import { getSustainabilityData } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getSustainabilityData);

export default router;
