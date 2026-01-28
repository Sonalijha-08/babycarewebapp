const express = require("express");
const router = express.Router();
const Feeding = require("../models/feeding");
const auth = require("../middleware/auth");

// Add feeding log
router.post("/add", auth, async (req, res) => {
  try {
    const { userId, time, type, amount, notes } = req.body;

    const newLog = new Feeding({
      userId,
      time,
      type,
      amount,
      notes
    });

    await newLog.save();
    res.json({ message: "Feeding log added!", log: newLog });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all feeding logs
router.get("/:userId", auth, async (req, res) => {
  try {
    const logs = await Feeding.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
