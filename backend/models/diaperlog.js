const mongoose = require("mongoose");

const DiaperLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  }
}, { timestamps: true });

module.exports = mongoose.model("DiaperLog", DiaperLogSchema);
