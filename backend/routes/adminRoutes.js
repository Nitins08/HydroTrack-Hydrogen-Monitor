import express from 'express';
import { 
  getUsers, 
  updateUserRole, 
  deleteUser 
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here require valid JWT authentication and role === 'admin'
router.use(protect, requireAdmin);

router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
