const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addVaccination,
  getVaccinations,
  deleteVaccination
} = require("../controllers/vaccinationsController");

// Add vaccination
router.post("/add", auth, addVaccination);

// Get vaccinations by user
router.get("/:userId", auth, getVaccinations);

// Delete vaccination
router.delete("/:id", auth, deleteVaccination);

module.exports = router;
