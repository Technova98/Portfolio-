import express from 'express';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getUnreadCount,
  testEmail
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/unread/count')
  .get(protect, getUnreadCount);

router.route('/test-email')
  .post(protect, testEmail);

router.route('/')
  .get(protect, getContacts)
  .post(createContact);

router.route('/:id')
  .put(protect, updateContact)
  .delete(protect, deleteContact);

export default router;

