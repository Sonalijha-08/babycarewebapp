const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, req.user.id + '_' + unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  if (allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

// ─────────────────────────────────────────────────────────────────
// Helper: build full picture URL from just the filename stored in DB
// ─────────────────────────────────────────────────────────────────
const buildPictureUrl = (req, filename) => {
  if (!filename) return null;
  // If somehow a full path was stored already, return as-is
  if (filename.startsWith('http') || filename.startsWith('/uploads')) return filename;
  return `${req.protocol}://${req.get('host')}/uploads/profiles/${filename}`;
};

// ─────────────────────────────────────────────────────────────────
// GET /auth/profile
// ─────────────────────────────────────────────────────────────────
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profileData = user.toObject();
    // Always return full URL so frontend can use it directly as <img src>
    profileData.profilePicture = buildPictureUrl(req, user.profilePicture);

    res.json(profileData);
  } catch (error) {
    console.error('GET profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────
// PUT /auth/profile
// ─────────────────────────────────────────────────────────────────
const { validateProfileUpdate } = require('../middleware/validators');

router.put('/profile', auth, upload.single('profilePicture'), validateProfileUpdate, async (req, res) => {
  try {
    const { name, email, phone, babyName, babyDOB } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!email || !email.trim()) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check email not taken by someone else
    if (email.trim() !== user.email) {
      const taken = await User.findOne({ email: email.trim(), _id: { $ne: req.user.id } });
      if (taken) return res.status(400).json({ message: 'Email already in use' });
    }

    // Update text fields
    user.name     = name.trim();
    user.email    = email.trim();
    user.phone    = phone    ? phone.trim()    : '';
    user.babyName = babyName ? babyName.trim() : '';
    user.babyDOB  = babyDOB  ? new Date(babyDOB) : null;

    // Handle profile picture
    if (req.file) {
      // Delete old file — user.profilePicture is JUST the filename, not a URL
      if (user.profilePicture) {
        // Strip any accidental URL prefix that may have been saved before
        const oldFilename = user.profilePicture.includes('/')
          ? user.profilePicture.split('/').pop()
          : user.profilePicture;
        const oldPath = path.join(uploadsDir, oldFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      // Store ONLY the filename in the database
      user.profilePicture = req.file.filename;
    }

    await user.save();

    // Build response
    const userData = user.toObject();
    delete userData.password;
    userData.profilePicture = buildPictureUrl(req, user.profilePicture);

    // Return the user object directly (not nested under "user" key)
    // so the frontend can read response.data directly
    res.json(userData);

  } catch (error) {
    console.error('PUT profile error:', error);
    if (req.file) {
      const fp = path.join(uploadsDir, req.file.filename);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────
// DELETE /auth/profile/picture
// ─────────────────────────────────────────────────────────────────
router.delete('/profile/picture', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.profilePicture) {
      const filename = user.profilePicture.includes('/')
        ? user.profilePicture.split('/').pop()
        : user.profilePicture;
      const picPath = path.join(uploadsDir, filename);
      if (fs.existsSync(picPath)) fs.unlinkSync(picPath);
      user.profilePicture = null;
      await user.save();
    }

    res.json({ message: 'Profile picture deleted' });
  } catch (error) {
    console.error('DELETE picture error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;