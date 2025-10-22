import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Stats', statsSchema);

