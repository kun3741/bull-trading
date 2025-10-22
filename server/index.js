import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import teamRoutes from './routes/team.js';
import advantagesRoutes from './routes/advantages.js';
import statsRoutes from './routes/stats.js';
import contentRoutes from './routes/content.js';
import authRoutes from './routes/auth.js';
import applicationsRoutes from './routes/applications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bulltrading', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/team', teamRoutes);
app.use('/api/advantages', advantagesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

