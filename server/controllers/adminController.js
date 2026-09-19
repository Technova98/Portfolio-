import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Admin from '../models/Admin.js';

// Ensure uploads directory exists
const uploadsRoot = path.resolve(process.cwd(), 'uploads');
const avatarsDir = path.join(uploadsRoot, 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${req.admin.id}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Multer middleware wrapper with error handling
export const uploadAvatar = (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size too large. Maximum size is 2MB.' });
        }
        return res.status(400).json({ message: err.message });
      }
      // Custom error from fileFilter
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please select an image file.' });
    }

    // Delete old avatar if it exists
    const oldAdmin = await Admin.findById(req.admin.id);
    if (oldAdmin && oldAdmin.avatarUrl) {
      const oldAvatarPath = path.join(uploadsRoot, oldAdmin.avatarUrl.replace('/uploads/', ''));
      if (fs.existsSync(oldAvatarPath)) {
        try {
          fs.unlinkSync(oldAvatarPath);
        } catch (unlinkError) {
          console.error('Error deleting old avatar:', unlinkError);
          // Continue even if deletion fails
        }
      }
    }

    const publicUrl = `/uploads/avatars/${req.file.filename}`;

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { avatarUrl: publicUrl },
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Profile photo updated successfully', admin });
  } catch (error) {
    console.error('Error updating profile photo:', error);
    res.status(500).json({ message: error.message || 'Failed to update profile photo' });
  }
};

// @desc    Get admin settings
// @route   GET /api/admin/settings
// @access  Private
export const getSettings = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('settings');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      notifications: admin.settings?.notifications || {
        email: true,
        contactMessages: true,
        projectUpdates: false,
        securityAlerts: true,
        weeklyReports: false
      },
      theme: admin.settings?.theme || 'system',
      advanced: admin.settings?.advanced || {
        apiKey: '',
        webhookUrl: '',
        cacheEnabled: true,
        analytics: true,
        backupFrequency: 'daily'
      }
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ message: error.message || 'Failed to get settings' });
  }
};

// @desc    Update admin settings
// @route   PUT /api/admin/settings
// @access  Private
export const updateSettings = async (req, res) => {
  try {
    const { notifications, theme, advanced } = req.body;
    const updates = {};

    if (notifications) {
      updates['settings.notifications'] = notifications;
    }
    if (theme) {
      updates['settings.theme'] = theme;
    }
    if (advanced) {
      updates['settings.advanced'] = advanced;
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      message: 'Settings updated successfully',
      settings: {
        notifications: admin.settings?.notifications,
        theme: admin.settings?.theme,
        advanced: admin.settings?.advanced
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: error.message || 'Failed to update settings' });
  }
};

// @desc    Regenerate API key
// @route   POST /api/admin/settings/regenerate-api-key
// @access  Private
export const regenerateApiKey = async (req, res) => {
  try {
    const crypto = (await import('crypto')).default;
    const newApiKey = `sk_live_${crypto.randomBytes(32).toString('hex')}`;

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { 'settings.advanced.apiKey': newApiKey },
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      message: 'API key regenerated successfully',
      apiKey: newApiKey
    });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    res.status(500).json({ message: error.message || 'Failed to regenerate API key' });
  }
};

// @desc    Clear cache
// @route   POST /api/admin/settings/clear-cache
// @access  Private
export const clearCache = async (req, res) => {
  try {
    // In a real application, you would clear your cache here
    // For now, we'll just return a success message
    // You can integrate with Redis, Memcached, or your caching solution
    
    res.json({
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ message: error.message || 'Failed to clear cache' });
  }
};


