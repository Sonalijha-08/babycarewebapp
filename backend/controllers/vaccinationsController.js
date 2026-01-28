const Vaccinations = require("../models/vaccinations");

// Add a new vaccination
const addVaccination = async (req, res) => {
  try {
    const { userId, vaccineName, dateAdministered, nextDueDate, notes } = req.body;

    const newVaccination = new Vaccinations({
      userId,
      vaccineName,
      dateAdministered,
      nextDueDate,
      notes
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
    const vaccinations = await Vaccinations.find({
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
    const vaccination = await Vaccinations.findById(req.params.id);
    if (!vaccination) return res.status(404).json({ message: "Vaccination not found" });

    if (vaccination.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await Vaccinations.findByIdAndDelete(req.params.id);
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
