const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: String,
  email: String,
  phone: String,
  babyName: String,
  babyDOB: Date,
  profileImage: String
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
