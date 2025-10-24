import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ім\'я обов\'язкове'],
    trim: true,
    minlength: [2, 'Ім\'я повинно містити мінімум 2 символи'],
    maxlength: [100, 'Ім\'я занадто довге']
  },
  phone: {
    type: String,
    required: [true, 'Телефон обов\'язковий'],
    trim: true,
    validate: {
      validator: function(v) {
        // Allow Ukrainian format (+380XXXXXXXXX), international (+...), or local (0XXXXXXXXX)
        const cleaned = v.replace(/[\s\-()]/g, '');
        return /^[\+\d]+$/.test(cleaned) && cleaned.length >= 8 && cleaned.length <= 15;
      },
      message: 'Невірний формат номера телефону'
    }
  },
  email: {
    type: String,
    required: [true, 'Email обов\'язковий'],
    trim: true,
    lowercase: true,
    maxlength: [254, 'Email занадто довгий'],
    validate: {
      validator: function(v) {
        // RFC 5322 simplified email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Невірний формат email'
    }
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
  },
  // Security and tracking fields
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  referer: {
    type: String,
    default: null
  },
  submissionCount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

export default mongoose.model('Application', applicationSchema);
