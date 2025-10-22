import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    enum: ['hero', 'about', 'advantages', 'team', 'contact', 'footer'],
  },
  title: String,
  subtitle: String,
  description: String,
  buttonText: String,
  content: mongoose.Schema.Types.Mixed,
  // About section specific fields
  titleHighlight: String,
  paragraph1: String,
  paragraph2: String,
  paragraph3: String,
  // Footer specific fields
  phone: String,
  email: String,
  instagram: String,
  telegram: String,
  viber: String,
  facebook: String,
  // Contact section specific fields (titleHighlight is already defined for about)
}, {
  timestamps: true,
});

export default mongoose.model('Content', contentSchema);

