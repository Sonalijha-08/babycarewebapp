const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addVaccination,
  getVaccinations,
  deleteVaccination
} = require("../controllers/vaccinationsController");

const { validateVaccinationAdd, validateIdParam } = require('../middleware/validators');

router.post("/add", auth, validateVaccinationAdd, addVaccination);

router.get("/:userId", auth, getVaccinations);

router.delete("/:id", auth, deleteVaccination);

module.exports = router;
