const Vaccination = require("../models/vaccinations");

// Add a new vaccination
const addVaccination = async (req, res) => {
  try {
    const { sendValidationErrors } = require('../middleware/validators');
    if (sendValidationErrors(req, res)) return;

    const { date, vaccineName, amount, duration, side, notes, nextVaccinationDate, reminderEnabled } = req.body;

    const newVaccination = new Vaccination({
      userId: req.user.id,
      date,
      vaccineName,
      amount,
      duration,
      side,
      notes,
      nextVaccinationDate,
      reminderEnabled
    });

    await newVaccination.save();
    res.json({ message: "Vaccination added!", vaccination: newVaccination });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get vaccinations by user
const getVaccinations = async (req, res) => {
  try {
    const vaccinations = await Vaccination.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(vaccinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a vaccination
const deleteVaccination = async (req, res) => {
  try {
    const vaccination = await Vaccination.findById(req.params.id);
    if (!vaccination) return res.status(404).json({ message: "Vaccination not found" });

    if (vaccination.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await Vaccination.findByIdAndDelete(req.params.id);
    res.json({ message: "Vaccination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addVaccination,
  getVaccinations,
  deleteVaccination
};
