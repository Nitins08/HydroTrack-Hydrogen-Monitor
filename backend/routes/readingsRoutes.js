import express from 'express';
import { 
  getReadings, 
  addReading, 
  updateReading, 
  deleteReading 
} from '../controllers/readingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getReadings)
  .post(protect, addReading);

router.route('/:id')
  .put(protect, updateReading)
  .delete(protect, deleteReading);

export default router;
