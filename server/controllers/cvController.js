import multer from 'multer';
import path from 'path';
import fs from 'fs';
import CV from '../models/CV.js';

// Ensure uploads directory exists
const uploadsRoot = path.resolve(process.cwd(), 'uploads');
const cvDir = path.join(uploadsRoot, 'cv');
if (!fs.existsSync(cvDir)) {
  fs.mkdirSync(cvDir, { recursive: true });
}

// Multer storage configuration for CV
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, cvDir);
  },
  filename: function (req, file, cb) {
    // Use a consistent filename: cv.pdf
    // This ensures we always know the filename for download
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, `cv${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Only allow PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for CV'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for CV
});

// Multer middleware wrapper with error handling
export const uploadCV = (req, res, next) => {
  upload.single('cv')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: err.message });
      }
      // Custom error from fileFilter
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// @desc    Upload CV (Admin only)
// @route   POST /api/cv/upload
// @access  Private
export const uploadCVFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please select a PDF file.' });
    }

    // Deactivate all existing CVs
    await CV.updateMany({}, { isActive: false });

    // Delete old CV file if it exists
    const oldCV = await CV.findOne({ isActive: true });
    if (oldCV && oldCV.filePath) {
      const oldFilePath = path.join(uploadsRoot, oldCV.filePath.replace('/uploads/', ''));
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (unlinkError) {
          console.error('Error deleting old CV:', unlinkError);
          // Continue even if deletion fails
        }
      }
    }

    // Create new CV record
    const cv = new CV({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: `/uploads/cv/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.admin.id,
      isActive: true,
      downloadCount: 0
    });

    await cv.save();

    res.json({
      message: 'CV uploaded successfully',
      cv: {
        id: cv._id,
        filename: cv.filename,
        originalName: cv.originalName,
        fileSize: cv.fileSize,
        uploadedAt: cv.createdAt,
        downloadCount: cv.downloadCount
      }
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ message: error.message || 'Failed to upload CV' });
  }
};

// @desc    Get CV info (Public)
// @route   GET /api/cv
// @access  Public
export const getCVInfo = async (req, res) => {
  try {
    const cv = await CV.findOne({ isActive: true })
      .populate('uploadedBy', 'username email')
      .select('-filePath'); // Don't expose internal file path

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    res.json({
      id: cv._id,
      filename: cv.originalName,
      fileSize: cv.fileSize,
      uploadedAt: cv.createdAt,
      updatedAt: cv.updatedAt,
      downloadCount: cv.downloadCount,
      downloadUrl: `/api/cv/download`
    });
  } catch (error) {
    console.error('Error getting CV info:', error);
    res.status(500).json({ message: error.message || 'Failed to get CV information' });
  }
};

// @desc    Download CV (Public)
// @route   GET /api/cv/download
// @access  Public
export const downloadCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ isActive: true });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const filePath = path.join(uploadsRoot, cv.filePath.replace('/uploads/', ''));

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'CV file not found on server' });
    }

    // Increment download count
    cv.downloadCount += 1;
    await cv.save();

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cv.originalName}"`);
    res.setHeader('Content-Length', cv.fileSize);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading CV:', error);
    res.status(500).json({ message: error.message || 'Failed to download CV' });
  }
};

// @desc    Get CV info for admin (with file path)
// @route   GET /api/cv/admin
// @access  Private
export const getCVInfoAdmin = async (req, res) => {
  try {
    const cv = await CV.findOne({ isActive: true })
      .populate('uploadedBy', 'username email');

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    res.json(cv);
  } catch (error) {
    console.error('Error getting CV info:', error);
    res.status(500).json({ message: error.message || 'Failed to get CV information' });
  }
};

// @desc    Update CV (replace existing)
// @route   PUT /api/cv/:id
// @access  Private
export const updateCV = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Check if user is authorized (uploaded by them or is admin)
    if (cv.uploadedBy.toString() !== req.admin.id) {
      return res.status(403).json({ message: 'Not authorized to update this CV' });
    }

    // Update CV metadata (if file is provided, it should be uploaded first)
    const updates = {};
    if (req.body.originalName) updates.originalName = req.body.originalName;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    const updatedCV = await CV.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'username email');

    res.json({
      message: 'CV updated successfully',
      cv: updatedCV
    });
  } catch (error) {
    console.error('Error updating CV:', error);
    res.status(500).json({ message: error.message || 'Failed to update CV' });
  }
};

// @desc    Delete CV (Admin only)
// @route   DELETE /api/cv/:id
// @access  Private
export const deleteCV = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Check if user is authorized (uploaded by them or is admin)
    if (cv.uploadedBy.toString() !== req.admin.id) {
      return res.status(403).json({ message: 'Not authorized to delete this CV' });
    }

    // Delete the file from disk
    if (cv.filePath) {
      const filePath = path.join(uploadsRoot, cv.filePath.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkError) {
          console.error('Error deleting CV file:', unlinkError);
          // Continue with database deletion even if file deletion fails
        }
      }
    }

    // Delete from database
    await CV.findByIdAndDelete(req.params.id);

    res.json({ message: 'CV deleted successfully' });
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ message: error.message || 'Failed to delete CV' });
  }
};

// @desc    Delete active CV (Admin only)
// @route   DELETE /api/cv
// @access  Private
export const deleteActiveCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ isActive: true });

    if (!cv) {
      return res.status(404).json({ message: 'No active CV found' });
    }

    // Check if user is authorized
    if (cv.uploadedBy.toString() !== req.admin.id) {
      return res.status(403).json({ message: 'Not authorized to delete this CV' });
    }

    // Delete the file from disk
    if (cv.filePath) {
      const filePath = path.join(uploadsRoot, cv.filePath.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkError) {
          console.error('Error deleting CV file:', unlinkError);
          // Continue with database deletion even if file deletion fails
        }
      }
    }

    // Delete from database
    await CV.findByIdAndDelete(cv._id);

    res.json({ message: 'CV deleted successfully' });
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ message: error.message || 'Failed to delete CV' });
  }
};

