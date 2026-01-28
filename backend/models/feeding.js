const mongoose = require("mongoose");

const FeedingSchema = new mongoose.Schema({
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
    enum: ["Breastmilk", "Formula", "Solid"],
    required: true
  },
  amount: {
    type: Number, // in ml
    required: true
  },
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Feeding", FeedingSchema);
