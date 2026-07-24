import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateAccessibilityPreferences,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/preferences', protect, updateAccessibilityPreferences);

export default router;
