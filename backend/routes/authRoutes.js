const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authcontroller");
const profileRouter = require("./profileRoutes");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);

// Mount profile routes — this handles GET /auth/profile and PUT /auth/profile
router.use("/", profileRouter);

module.exports = router;