import Admin from '../models/Admin.js';
import { generateToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendPasswordResetConfirmation } from '../utils/emailService.js';

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Private (first admin only)
export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({
      username,
      fullName: username,
      email,
      password
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        location: admin.location,
        website: admin.website,
        bio: admin.bio,
        token: generateToken(admin._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && await admin.comparePassword(password)) {
      res.json({
        _id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        avatarUrl: admin.avatarUrl,
        phone: admin.phone,
        location: admin.location,
        website: admin.website,
        bio: admin.bio,
        token: generateToken(admin._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      _id: admin._id,
      username: admin.username,
      fullName: admin.fullName,
      email: admin.email,
      avatarUrl: admin.avatarUrl,
      phone: admin.phone,
      location: admin.location,
      website: admin.website,
      bio: admin.bio
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request password reset (sends email with reset token)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!admin) {
      return res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = admin.getResetPasswordToken();
    await admin.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password/${resetToken}`;

    try {
      // Send email
      const emailResult = await sendPasswordResetEmail(
        admin.email,
        resetToken,
        admin.fullName || admin.username
      );

      if (!emailResult.success) {
        // If email fails, clear the reset token
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;
        await admin.save({ validateBeforeSave: false });

        console.error('Email sending failed:', emailResult.error);
        return res.status(500).json({ 
          message: 'Email could not be sent. Please check your SMTP configuration.' 
        });
      }

      return res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    } catch (error) {
      // If email fails, clear the reset token
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;
      await admin.save({ validateBeforeSave: false });

      console.error('Error sending password reset email:', error);
      return res.status(500).json({ 
        message: 'Email could not be sent. Please check your SMTP configuration.' 
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPasswordWithToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Get hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find admin with matching token and non-expired token
    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    // Send confirmation email
    try {
      await sendPasswordResetConfirmation(
        admin.email,
        admin.fullName || admin.username
      );
    } catch (emailError) {
      // Don't fail the request if confirmation email fails
      console.error('Failed to send confirmation email:', emailError);
    }

    return res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Reset admin password (guarded by setup secret) - Legacy endpoint
// @route   POST /api/auth/reset-password
// @access  Private (requires header X-Setup-Secret matching ADMIN_SETUP_SECRET)
export const resetPassword = async (req, res) => {
  try {
    const setupSecret = process.env.ADMIN_SETUP_SECRET;
    const provided = req.header('X-Setup-Secret');

    if (!setupSecret || !provided || provided !== setupSecret) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and newPassword are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.password = newPassword;
    await admin.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['username', 'fullName', 'email', 'phone', 'location', 'website', 'bio'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    });

    if (updates.email) {
      const emailOwner = await Admin.findOne({ email: updates.email, _id: { $ne: req.admin.id } });
      if (emailOwner) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    if (updates.username) {
      const usernameOwner = await Admin.findOne({ username: updates.username, _id: { $ne: req.admin.id } });
      if (usernameOwner) {
        return res.status(400).json({ message: 'Username is already in use' });
      }
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.json(admin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

