const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addGrowthRecord,
  getGrowthRecords,
  deleteGrowthRecord
} = require("../controllers/growthtrackerController");

// ➕ Add Growth Record
router.post("/add", auth, addGrowthRecord);

// 📥 Get Growth Records by User
router.get("/:userId", auth, getGrowthRecords);

// 🗑️ Delete Growth Record
router.delete("/:id", auth, deleteGrowthRecord);

module.exports = router;
