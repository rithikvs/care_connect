const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  problem_type: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['LOW', 'NORMAL', 'HIGH'], default: 'NORMAL' },
  summary: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);
