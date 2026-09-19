import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';

// Import routes
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import path from 'path';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cv', cvRoutes);

// Public CV download route
app.get('/download-cv', async (req, res) => {
  try {
    const CV = (await import('./models/CV.js')).default;
    const pathModule = (await import('path')).default;
    const fs = (await import('fs')).default;
    
    const cv = await CV.findOne({ isActive: true });
    
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    
    const uploadsRoot = pathModule.resolve(process.cwd(), 'uploads');
    const filePath = pathModule.join(uploadsRoot, cv.filePath.replace('/uploads/', ''));
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'CV file not found on server' });
    }
    
    // Increment download count
    cv.downloadCount += 1;
    await cv.save();
    
    // Set headers for file download with original filename
    // Escape filename for proper download
    const filename = cv.originalName || 'cv.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Length', cv.fileSize);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading CV:', error);
    res.status(500).json({ message: error.message || 'Failed to download CV' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running successfully!' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle port already in use error
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please:`);
    console.error(`1. Stop the other process using port ${PORT}`);
    console.error(`2. Or change the PORT in your .env file`);
    console.error(`\nTo find and kill the process on port ${PORT}, run:`);
    console.error(`  netstat -ano | findstr :${PORT}`);
    console.error(`  taskkill /PID <PID> /F`);
    process.exit(1);
  } else {
    throw error;
  }
});

