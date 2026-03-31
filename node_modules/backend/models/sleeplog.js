const mongoose = require("mongoose");

const sleepLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  sleepTime: {
    type: String,
    required: true
  },
  wakeTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("SleepLog", sleepLogSchema);
