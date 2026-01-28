const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addDiaperLog,
  getDiaperLogs,
  deleteDiaperLog
} = require("../controllers/diaperlogController");

// ➕ Add Diaper Log
router.post("/add", auth, addDiaperLog);

// 📥 Get Diaper Logs by User
router.get("/:userId", auth, getDiaperLogs);

// 🗑️ Delete Diaper Log
router.delete("/:id", auth, deleteDiaperLog);

module.exports = router;
