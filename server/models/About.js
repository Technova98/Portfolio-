import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  bio: {
    type: String,
    required: true
  },
  expertise: [{
    title: String,
    description: String,
    color: String
  }],
  stats: [{
    number: String,
    label: String
  }],
  introduction: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('About', aboutSchema);

