const router = require('express').Router();
const auth   = require('../middleware/auth');
const Saving = require('../models/Saving');

// GET /api/savings
router.get('/', auth, async (req, res) => {
  try {
    const savings = await Saving.find({ userId: req.user.id }).sort({ month: -1, createdAt: -1 });
    res.json(savings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/savings
router.post('/', auth, async (req, res) => {
  try {
    const { month, type, desc, amt } = req.body;
    if (!month || !type || !amt || amt <= 0) {
      return res.status(400).json({ error: 'month, type and a positive amt are required.' });
    }
    const saving = await Saving.create({ userId: req.user.id, month, type, desc: desc || type, amt });
    res.status(201).json(saving);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/savings/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const saving = await Saving.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!saving) return res.status(404).json({ error: 'Saving not found.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
