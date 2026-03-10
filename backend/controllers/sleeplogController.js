const SleepLog = require("../models/sleeplog");

// Add a new sleep log
const addSleepLog = async (req, res) => {
  try {
    const { userId, date, sleepTime, wakeTime, duration, notes } = req.body;

    const newLog = new SleepLog({
      userId,
      date,
      sleepTime,
      wakeTime,
      duration,
      notes
    });

    await newLog.save();
    res.json({ message: "Sleep log added!", log: newLog });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get sleep logs by user
const getSleepLogs = async (req, res) => {
  try {
    const sleeps = await SleepLog.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(sleeps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a sleep log
const deleteSleepLog = async (req, res) => {
  try {
    const sleepLog = await SleepLog.findById(req.params.id);
    if (!sleepLog) return res.status(404).json({ message: "Sleep log not found" });

    if (sleepLog.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await SleepLog.findByIdAndDelete(req.params.id);
    res.json({ message: "Sleep log deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSleepLog,
  getSleepLogs,
  deleteSleepLog
};
