const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authcontroller");
const profileRouter = require("./profileRoutes");
const auth = require("../middleware/auth");

const { validateRegister, validateLogin } = require('../middleware/validators');

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Mount profile routes — this handles GET /auth/profile and PUT /auth/profile
router.use("/", profileRouter);

module.exports = router;