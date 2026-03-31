const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { sendEmail } = require("../utils/email");

// ─────────────────────────────────────────────
// Multer setup (lives HERE so authRoutes can use it)
// ─────────────────────────────────────────────
const uploadsDir = path.join(__dirname, "../uploads/profiles");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, req.user.id + "_" + unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  if (allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// Export this so authRoutes.js can use it as middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// ─────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { sendValidationErrors } = require('../middleware/validators');
    sendValidationErrors(req, res);

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send login notification email (non-blocking — log errors only)
    try {
      const subject = "Login notification — Baby Care";
      const text = `Hi ${user.name || "User"},\n\nYou have successfully logged in to Baby Care using ${user.email}. If this wasn't you, please secure your account.`;
      const html = `<p>Hi ${user.name || "User"},</p><p>You have successfully logged in to <strong>Baby Care</strong> using <code>${user.email}</code>.</p><p>If this wasn't you, please secure your account.</p>`;
      sendEmail(user.email, subject, text, html).catch((err) => console.error("Login email error:", err));
    } catch (err) {
      console.error("Failed to queue login email:", err);
    }

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// GET /auth/profile
// ─────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const profileData = user.toObject();

    // profilePicture stored as just filename → build full URL here
    if (user.profilePicture) {
      profileData.profilePicture = `${req.protocol}://${req.get("host")}/uploads/profiles/${user.profilePicture}`;
    }

    res.json(profileData);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// PUT /auth/profile
// ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, babyName, babyDOB } = req.body;

    // Basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if email is taken by someone else
    if (email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update text fields
    user.name = name.trim();
    user.email = email.trim();
    user.phone = phone ? phone.trim() : "";
    user.babyName = babyName ? babyName.trim() : "";
    user.babyDOB = babyDOB ? new Date(babyDOB) : null;

    // Handle profile picture upload
    if (req.file) {
      // Delete old picture from disk
      if (user.profilePicture) {
        const oldPath = path.join(uploadsDir, user.profilePicture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      // Save only the filename to DB
      user.profilePicture = req.file.filename;
    }

    await user.save();

    // Build response — return full URL for profile picture
    const userData = user.toObject();
    delete userData.password;

    if (user.profilePicture) {
      userData.profilePicture = `${req.protocol}://${req.get("host")}/uploads/profiles/${user.profilePicture}`;
    }

    res.json(userData);
  } catch (error) {
    console.error("Update profile error:", error);

    // Clean up uploaded file if save failed
    if (req.file) {
      const filePath = path.join(uploadsDir, req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, getProfile, updateProfile, upload };