import express from 'express';
import {
  getAbout,
  updateAbout
} from '../controllers/aboutController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAbout)
  .post(protect, updateAbout)
  .put(protect, updateAbout);

export default router;

