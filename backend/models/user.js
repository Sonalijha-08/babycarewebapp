const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  babyName: {
    type: String,
  },
  babyDOB: {
    type: Date,
  },
  profilePicture: {
    type: String, // URL or path to the image
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
