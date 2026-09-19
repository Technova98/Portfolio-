import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'content', 'fullstack', 'mobile', 'other'],
    default: 'frontend'
  },
  description: {
    type: String,
    required: true
  },
  technologies: [{
    type: String
  }],
  liveUrl: {
    type: String
  },
  githubUrl: {
    type: String
  },
  youtubeUrl: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  year: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Ongoing', 'Upcoming'],
    default: 'Completed'
  },
  views: {
    type: String
  },
  subscribers: {
    type: String
  },
  engagement: {
    type: String
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);

