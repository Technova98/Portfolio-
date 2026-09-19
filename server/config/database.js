import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio_db';
    
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    };

    const conn = await mongoose.connect(mongoURI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    // Don't exit process, allow server to continue running
    // The server can still serve other endpoints even if DB is down
    console.log('Server will continue running without database connection. Retrying in background...');
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

export default connectDB;

