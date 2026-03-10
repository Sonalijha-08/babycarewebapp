const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addSleepLog,
  getSleepLogs,
  deleteSleepLog
} = require("../controllers/sleeplogController");

// ➕ Add Sleep Log
router.post("/add", auth, addSleepLog);

// 📥 Get Sleep Logs by User
router.get("/:userId", auth, getSleepLogs);

// 🗑️ Delete Sleep Log
router.delete("/:id", auth, deleteSleepLog);

module.exports = router;
