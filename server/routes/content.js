import express from 'express';
import Content from '../models/Content.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all content sections
router.get('/', async (req, res) => {
  try {
    const content = await Content.find();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get content by section
router.get('/:section', async (req, res) => {
  try {
    const content = await Content.findOne({ section: req.params.section });
    if (!content) {
      return res.status(404).json({ error: 'Content section not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update content section (protected)
router.post('/:section', authMiddleware, async (req, res) => {
  try {
    const content = await Content.findOneAndUpdate(
      { section: req.params.section },
      { ...req.body, section: req.params.section },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

