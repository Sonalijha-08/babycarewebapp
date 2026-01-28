const express = require("express");
const router = express.Router();
const Vaccination = require("../models/vaccinations");
const auth = require("../middleware/auth");

// Add vaccination log
router.post("/add", auth, async (req, res) => {
  try {
    const { userId, date, time, vaccineName, amount, duration, side, notes } = req.body;

    const newLog = new Vaccination({
      userId,
      date,
      time,
      vaccineName,
      amount,
      duration,
      side,
      notes
    });

    await newLog.save();
    res.json({ message: "Vaccination log added!", log: newLog });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all vaccination logs
router.get("/:userId", auth, async (req, res) => {
  try {
    const logs = await Vaccination.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
