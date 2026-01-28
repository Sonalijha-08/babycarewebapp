const Feeding = require("../models/feeding");

// Add a new feeding record
const addFeeding = async (req, res) => {
  try {
    const { date, time, type, amount, notes } = req.body;
    const userId = req.user.id;

    const newFeeding = new Feeding({
      userId,
      date,
      time,
      type,
      amount: amount ? parseFloat(amount) : undefined,
      notes
    });

    await newFeeding.save();
    res.status(201).json({ message: "Feeding record added successfully", feeding: newFeeding });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all feeding records for a user
const getFeedings = async (req, res) => {
  try {
    const feedings = await Feeding.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(feedings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a feeding record
const deleteFeeding = async (req, res) => {
  try {
    const feeding = await Feeding.findById(req.params.id);
    if (!feeding) return res.status(404).json({ message: "Feeding record not found" });

    if (feeding.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await Feeding.findByIdAndDelete(req.params.id);
    res.json({ message: "Feeding record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFeeding,
  getFeedings,
  deleteFeeding
};
