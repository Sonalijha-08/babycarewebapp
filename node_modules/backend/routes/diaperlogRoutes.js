const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addDiaperLog,
  getDiaperLogs,
  deleteDiaperLog,
  updateDiaperReminder
} = require("../controllers/diaperlogController");

const { validateDiaperAdd, validateIdParam } = require('../middleware/validators');

router.post("/add", auth, validateDiaperAdd, addDiaperLog);

router.get("/:userId", auth, getDiaperLogs);

router.delete("/:id", auth, deleteDiaperLog);

router.post("/update-reminder/:id", auth, updateDiaperReminder);

module.exports = router;
