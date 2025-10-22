import express from 'express';
import Stats from '../models/Stats.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all stats
router.get('/', async (req, res) => {
  try {
    const stats = await Stats.find().sort({ order: 1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single stat
router.get('/:id', async (req, res) => {
  try {
    const stat = await Stats.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ error: 'Stat not found' });
    }
    res.json(stat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create stat (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const stat = new Stats(req.body);
    await stat.save();
    res.status(201).json(stat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update stat (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const stat = await Stats.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!stat) {
      return res.status(404).json({ error: 'Stat not found' });
    }
    res.json(stat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete stat (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const stat = await Stats.findByIdAndDelete(req.params.id);
    if (!stat) {
      return res.status(404).json({ error: 'Stat not found' });
    }
    res.json({ message: 'Stat deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

