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

const { validateFeedingAdd, validateIdParam } = require('../middleware/validators');

router.post("/add", authMiddleware, validateFeedingAdd, addFeeding);

router.get("/:userId", authMiddleware, getFeedings);

router.delete("/:id", authMiddleware, deleteFeeding);

router.post("/send-reminder", authMiddleware, sendFeedingReminder);

router.patch("/reminder/:id", authMiddleware, updateReminder);

module.exports = router;
