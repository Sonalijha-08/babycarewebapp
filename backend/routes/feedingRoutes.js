const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { 
  addFeeding, 
  getFeedings, 
  deleteFeeding,
  sendFeedingReminder 
} = require("../controllers/feedingController");
const { updateReminder } = require("../controllers/feedingController");

// Add a new feeding
router.post("/add", authMiddleware, addFeeding);

// Get all feedings for a user
router.get("/:userId", authMiddleware, getFeedings);

// Delete a feeding
router.delete("/:id", authMiddleware, deleteFeeding);

// Send feeding reminder email
router.post("/send-reminder", authMiddleware, sendFeedingReminder);

// Update reminder settings for an existing feeding
router.patch("/reminder/:id", authMiddleware, updateReminder);

module.exports = router;
