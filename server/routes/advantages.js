import express from 'express';
import Advantage from '../models/Advantage.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all advantages
router.get('/', async (req, res) => {
  try {
    const advantages = await Advantage.find().sort({ order: 1 });
    res.json(advantages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single advantage
router.get('/:id', async (req, res) => {
  try {
    const advantage = await Advantage.findById(req.params.id);
    if (!advantage) {
      return res.status(404).json({ error: 'Advantage not found' });
    }
    res.json(advantage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create advantage (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const advantage = new Advantage(req.body);
    await advantage.save();
    res.status(201).json(advantage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update advantage (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const advantage = await Advantage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!advantage) {
      return res.status(404).json({ error: 'Advantage not found' });
    }
    res.json(advantage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete advantage (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const advantage = await Advantage.findByIdAndDelete(req.params.id);
    if (!advantage) {
      return res.status(404).json({ error: 'Advantage not found' });
    }
    res.json({ message: 'Advantage deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

