const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:  { type: String, required: true },
  color: { type: String, default: '#888888' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true },           // bcrypt hash
  budget:      { type: Number, default: 0 },
  savingsGoal: { type: Number, default: 0 },
  categories:  { type: [categorySchema], default: [] },
  catLimits:   { type: Map, of: Number, default: {} },
  savLimits:   { type: Map, of: Number, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
