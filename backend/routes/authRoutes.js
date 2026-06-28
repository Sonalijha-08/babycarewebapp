const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile, upload } = require("../controllers/authcontroller");
const auth = require("../middleware/auth");

const { validateRegister, validateLogin, validateProfileUpdate } = require('../middleware/validators');

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Profile routes (called as /api/auth/profile by the frontend)
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("profilePicture"), validateProfileUpdate, updateProfile);

module.exports = router;