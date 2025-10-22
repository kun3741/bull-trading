import mongoose from 'mongoose';

const advantageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
    enum: ['TrendingUp', 'Wallet', 'Users', 'GraduationCap', 'Clock', 'Shield'],
  },
  color: {
    type: String,
    default: 'text-primary',
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Advantage', advantageSchema);

