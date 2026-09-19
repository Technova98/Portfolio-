import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getMe,
  resetPassword,
  forgotPassword,
  resetPasswordWithToken,
  updateProfile,
  updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/register')
  .post(registerAdmin);

router.route('/login')
  .post(loginAdmin);

router.route('/me')
  .get(protect, getMe);

// Password reset via email
router.route('/forgot-password')
  .post(forgotPassword);

router.route('/reset-password/:token')
  .post(resetPasswordWithToken);

// Legacy reset password (with setup secret)
router.route('/reset-password')
  .post(resetPassword);

router.route('/profile')
  .put(protect, updateProfile);

router.route('/password')
  .put(protect, updatePassword);

export default router;

