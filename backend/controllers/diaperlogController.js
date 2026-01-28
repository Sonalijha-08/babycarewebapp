const DiaperLog = require("../models/diaperlog");

// Add a new diaper log
const addDiaperLog = async (req, res) => {
  try {
    const { userId, date, time, type, notes } = req.body;

    const newLog = new DiaperLog({
      userId,
      date,
      time,
      type,
      notes
    });

    await newLog.save();
    res.json({ message: "Diaper log added!", log: newLog });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get diaper logs by user
const getDiaperLogs = async (req, res) => {
  try {
    const diaperLogs = await DiaperLog.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(diaperLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a diaper log
const deleteDiaperLog = async (req, res) => {
  try {
    const diaperLog = await DiaperLog.findById(req.params.id);
    if (!diaperLog) return res.status(404).json({ message: "Diaper log not found" });

    if (diaperLog.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await DiaperLog.findByIdAndDelete(req.params.id);
    res.json({ message: "Diaper log deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addDiaperLog,
  getDiaperLogs,
  deleteDiaperLog
};
