import express from 'express';
import { 
  getReadings, 
  addReading, 
  updateReading, 
  deleteReading 
} from '../controllers/readingsController.js';

const router = express.Router();

router.route('/')
  .get(getReadings)
  .post(addReading);

router.route('/:id')
  .put(updateReading)
  .delete(deleteReading);

export default router;
