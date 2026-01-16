const express = require("express");
const router = express.Router();
const SleepLog = require("../models/sleeplog");

// Save sleep log
router.post("/", async (req, res) => {
  try {
    const sleep = new SleepLog(req.body);
    await sleep.save();
    res.status(201).json({ message: "Sleep log saved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save sleep log" });
  }
});

// Get all sleep logs
router.get("/", async (req, res) => {
  const logs = await SleepLog.find();
  res.json(logs);
});

module.exports = router;
