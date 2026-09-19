import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  uploadAvatar,
  updateProfilePhoto,
  getSettings,
  updateSettings,
  regenerateApiKey,
  clearCache
} from '../controllers/adminController.js';

const router = express.Router();

// Update admin profile photo
router.put('/profile/photo', protect, uploadAvatar, updateProfilePhoto);

// Settings routes
router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);
router.post('/settings/regenerate-api-key', protect, regenerateApiKey);
router.post('/settings/clear-cache', protect, clearCache);

export default router;


