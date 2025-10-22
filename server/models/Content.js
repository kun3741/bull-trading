import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    enum: ['hero', 'about', 'advantages', 'team', 'contact'],
  },
  title: String,
  subtitle: String,
  description: String,
  buttonText: String,
  content: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

export default mongoose.model('Content', contentSchema);

