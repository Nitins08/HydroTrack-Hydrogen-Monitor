import express from 'express';
import { getReadings, addReading } from '../controllers/readingsController.js';

const router = express.Router();

router.route('/')
  .get(getReadings)
  .post(addReading);

export default router;
