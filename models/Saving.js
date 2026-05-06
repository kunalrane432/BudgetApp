const mongoose = require('mongoose');

const savingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  month:  { type: String, required: true },   // "YYYY-MM"
  type:   { type: String, required: true },   // FHSA, TFSA, RRSP, etc.
  desc:   { type: String, default: '' },
  amt:    { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Saving', savingSchema);
