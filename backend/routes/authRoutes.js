const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authcontroller");
const auth = require("../middleware/auth");

const { validateRegister, validateLogin } = require('../middleware/validators');

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

module.exports = router;