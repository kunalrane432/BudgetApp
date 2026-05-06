const router  = require('express').Router();
const auth    = require('../middleware/auth');
const Expense = require('../models/Expense');

// GET /api/expenses  — all expenses for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ month: -1, createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/expenses
router.post('/', auth, async (req, res) => {
  try {
    const { month, cat, desc, amt } = req.body;
    if (!month || !cat || !amt || amt <= 0) {
      return res.status(400).json({ error: 'month, cat and a positive amt are required.' });
    }
    const expense = await Expense.create({ userId: req.user.id, month, cat, desc: desc || cat, amt });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ error: 'Expense not found.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
