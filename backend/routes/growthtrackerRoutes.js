const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addGrowthRecord,
  getGrowthRecords,
  deleteGrowthRecord
} = require("../controllers/growthtrackerController");

const { validateGrowthAdd, validateIdParam } = require('../middleware/validators');

router.post("/add", auth, validateGrowthAdd, addGrowthRecord);

router.get("/:userId", auth, getGrowthRecords);

router.delete("/:id", auth, deleteGrowthRecord);

module.exports = router;
