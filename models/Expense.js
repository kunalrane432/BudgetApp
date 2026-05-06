const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  month:  { type: String, required: true },   // "YYYY-MM"
  cat:    { type: String, required: true },
  desc:   { type: String, default: '' },
  amt:    { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
