const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  addFeeding,
  getFeedings,
  deleteFeeding
} = require("../controllers/feedingController");

// 🔐 Protected routes
router.post("/add", auth, addFeeding);
router.get("/:userId", auth, getFeedings);
router.delete("/:id", auth, deleteFeeding);

module.exports = router;
