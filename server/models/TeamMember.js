import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  initials: {
    type: String,
    required: false,
  },
  photo: {
    type: String,
    required: false,
  },
  description: {
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

export default mongoose.model('TeamMember', teamMemberSchema);

