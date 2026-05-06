const router = require('express').Router();
const auth   = require('../middleware/auth');
const User   = require('../models/User');

function safeUser(u) {
  return {
    id:          u._id,
    name:        u.name,
    email:       u.email,
    budget:      u.budget,
    savingsGoal: u.savingsGoal,
    categories:  u.categories,
    catLimits:   Object.fromEntries(u.catLimits || []),
    savLimits:   Object.fromEntries(u.savLimits || [])
  };
}

// GET /api/settings  — fetch current user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(safeUser(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings  — update profile, budget, limits, categories
router.put('/', auth, async (req, res) => {
  try {
    const { name, budget, savingsGoal, catLimits, savLimits, categories } = req.body;
    const update = {};
    if (name)        update.name        = name;
    if (budget != null)      update.budget      = parseFloat(budget) || 0;
    if (savingsGoal != null) update.savingsGoal = parseFloat(savingsGoal) || 0;
    if (catLimits)   update.catLimits   = catLimits;
    if (savLimits)   update.savLimits   = savLimits;
    if (categories)  update.categories  = categories;
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });
    res.json(safeUser(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
