import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    default: 'application/pdf'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Only one active CV at a time
cvSchema.index({ isActive: 1 });

export default mongoose.model('CV', cvSchema);

