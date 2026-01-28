const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ msg: "User registered successfully" });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    userId: user._id,
    name: user.name,
    phone: user.phone,
    babyName: user.babyName,
    babyDOB: user.babyDOB,
    profilePicture: user.profilePicture,
  });
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = [
  upload.single('profilePicture'),
  async (req, res) => {
    try {
      const { name, email, phone, babyName, babyDOB } = req.body;
      const updateData = { name, email, phone, babyName };

      if (babyDOB) {
        updateData.babyDOB = new Date(babyDOB);
      }

      if (req.file) {
        updateData.profilePicture = `/uploads/${req.file.filename}`;
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      ).select('-password');

      if (!user) return res.status(404).json({ msg: "User not found" });

      res.json(user);
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  }
];
