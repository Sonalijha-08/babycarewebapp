// Backend Model: Vaccination.js
const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  vaccineName: {
    type: String,
    required: true
  },
  amount: {
    type: Number
  },
  duration: {
    type: String
  },
  side: {
    type: String,
    enum: ['Left', 'Right', 'Both', '']
  },
  notes: {
    type: String
  },
  nextVaccinationDate: {
    type: String
  },
  reminderEnabled: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);