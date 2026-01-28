const mongoose = require("mongoose");

const sleepLogSchema = new mongoose.Schema({
  babyName: String,
  sleepTime: String,
  wakeTime: String,
  date: String
});

module.exports = mongoose.model("SleepLog", sleepLogSchema);
