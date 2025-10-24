import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import teamRoutes from './routes/team.js';
import advantagesRoutes from './routes/advantages.js';
import statsRoutes from './routes/stats.js';
import contentRoutes from './routes/content.js';
import authRoutes from './routes/auth.js';
import applicationsRoutes from './routes/applications.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - важливо для отримання правильних IP адрес за reverse proxy (Render, Heroku, etc)
app.set('trust proxy', 1);

// Rate limiting для захисту від спаму
const applicationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 3, // максимум 3 заявки з одного IP за 15 хвилин
  message: { 
    message: 'Занадто багато заявок з цієї IP адреси. Будь ласка, спробуйте пізніше.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests from counting
  skipSuccessfulRequests: false,
  // Skip failed requests from counting
  skipFailedRequests: false,
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Занадто багато заявок з цієї IP адреси. Будь ласка, спробуйте через 15 хвилин.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 100, // максимум 100 запитів з одного IP за 15 хвилин
  message: { 
    message: 'Занадто багато запитів. Спробуйте пізніше.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bulltrading')
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/team', teamRoutes);
app.use('/api/advantages', advantagesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);
// Apply stricter rate limiting to application submissions
app.use('/api/applications', applicationLimiter, applicationsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  
  // Check if dist folder exists
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    // Handle React routing, return all requests to React app
    // Express 5 syntax - catch all non-API routes
    app.use((req, res, next) => {
      // If request doesn't start with /api, serve index.html
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        next();
      }
    });
    
    console.log(`📦 Serving static files from: ${distPath}`);
  } else {
    console.warn(`⚠️  dist folder not found at: ${distPath}`);
    console.warn(`⚠️  Run 'npm run build' first to generate production files`);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Serving static files from dist/`);
  }
});

