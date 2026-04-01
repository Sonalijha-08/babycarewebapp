const GrowthTracker = require("../models/growthtracker");

// Add a new growth record
const addGrowthRecord = async (req, res) => {
  try {
    const { sendValidationErrors } = require('../middleware/validators');
    if (sendValidationErrors(req, res)) return;

    const { userId, date, weight, height, headCircumference, notes } = req.body;

    const newRecord = new GrowthTracker({
      userId,
      date,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      headCircumference: headCircumference ? parseFloat(headCircumference) : undefined,
      notes
    });

    await newRecord.save();
    res.json({ message: "Growth record added!", record: newRecord });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get growth records by user
const getGrowthRecords = async (req, res) => {
  try {
    const growthRecords = await GrowthTracker.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(growthRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a growth record
const deleteGrowthRecord = async (req, res) => {
  try {
    const growthRecord = await GrowthTracker.findById(req.params.id);
    if (!growthRecord) return res.status(404).json({ message: "Growth record not found" });

    if (growthRecord.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await GrowthTracker.findByIdAndDelete(req.params.id);
    res.json({ message: "Growth record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addGrowthRecord,
  getGrowthRecords,
  deleteGrowthRecord
};
