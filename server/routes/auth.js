import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Simple admin login (in production, use a proper user model)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (username !== adminUsername) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In production, password should be hashed in env
    if (password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
    
    res.json({ token, username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

export default router;

