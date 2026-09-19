import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  uploadCV,
  uploadCVFile,
  getCVInfo,
  downloadCV,
  getCVInfoAdmin,
  updateCV,
  deleteCV,
  deleteActiveCV
} from '../controllers/cvController.js';

const router = express.Router();

// Public routes
router.get('/', getCVInfo);
router.get('/download', downloadCV);

// Admin routes (protected)
router.post('/upload', protect, uploadCV, uploadCVFile);
router.get('/admin', protect, getCVInfoAdmin);
router.delete('/', protect, deleteActiveCV); // Delete active CV (must come before /:id)
router.put('/:id', protect, updateCV);
router.delete('/:id', protect, deleteCV);

export default router;

