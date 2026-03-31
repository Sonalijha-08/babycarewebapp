const mongoose = require("mongoose");

const feedingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    default: "",
  },
  side: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  setReminder: {
    type: Boolean,
    default: false,
  },
  reminderMinutes: {
    type: Number,
    default: 15,
  },
  // How often to repeat the reminder (in minutes). Default 15 minutes.
  reminderIntervalMinutes: {
    type: Number,
    default: 15,
  },
  // How many reminder attempts have been sent
  reminderRepeatCount: {
    type: Number,
    default: 0,
  },
  // Max number of repeated reminders (optional)
  reminderRepeatLimit: {
    type: Number,
    default: 96,
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
  lastReminderSent: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Feeding", feedingSchema);
