const mongoose = require("mongoose");

const VaccinationSchema = new mongoose.Schema({
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
  vaccineName: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    default: ""
  },
  duration: {
    type: String,
    default: ""
  },
  side: {
    type: String,
    default: ""
  },
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Vaccination", VaccinationSchema);
