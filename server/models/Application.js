import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'completed', 'rejected'],
    default: 'new'
  },
  notes: {
    type: String,
    default: ''
  },
  telegramSent: {
    type: Boolean,
    default: false
  },
  telegramError: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Application', applicationSchema);
