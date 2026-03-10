const mongoose = require("mongoose");

const DiaperLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Wet", "Dirty", "Both"],
    required: true
  },
  notes: {
    type: String,
    default: ""
  },
  setReminder: {
    type: Boolean,
    default: false
  },
  reminderMinutes: {
    type: Number,
    default: 5
  },
  reminderIntervalMinutes: {
    type: Number,
    default: 15
  },
  reminderRepeatCount: {
    type: Number,
    default: 0
  },
  reminderRepeatLimit: {
    type: Number,
    default: 96
  },
  lastReminderSent: {
    type: Date,
    default: null
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("DiaperLog", DiaperLogSchema);
