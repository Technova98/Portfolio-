import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpire: {
    type: Date,
    default: null
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      contactMessages: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: false },
      securityAlerts: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: false }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    advanced: {
      apiKey: { type: String, default: '' },
      webhookUrl: { type: String, default: '' },
      cacheEnabled: { type: Boolean, default: true },
      analytics: { type: Boolean, default: true },
      backupFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate and hash password reset token
adminSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model('Admin', adminSchema);

