const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addSleepLog,
  getSleepLogs,
  deleteSleepLog
} = require("../controllers/sleeplogController");

const { validateSleepAdd, validateIdParam } = require('../middleware/validators');

router.post("/add", auth, validateSleepAdd, addSleepLog);

router.get("/:userId", auth, getSleepLogs);

router.delete("/:id", auth, deleteSleepLog);

module.exports = router;
