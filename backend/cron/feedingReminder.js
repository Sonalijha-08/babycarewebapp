const cron = require("node-cron");
const Feeding = require("../models/feeding");
const User = require("../models/User");
const sendEmail = require("../utils/resendEmail");

// DISABLED LEGACY CRON (use reminderScheduler.js instead):
// cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ Checking feeding reminders...");

  const now = new Date();

  const feedings = await Feeding.find().populate("userId");

  for (let feeding of feedings) {
    const diffInHours =
      (now - new Date(feeding.time)) / (1000 * 60 * 60);

    const reminderGap =
      feeding.lastReminderSent
        ? (now - feeding.lastReminderSent) / (1000 * 60 * 60)
        : diffInHours;

    if (diffInHours >= 2 && reminderGap >= 2) {
      await sendEmail(
        feeding.userId.email,
        "🍼 Feeding Reminder",
        `<p>It's time for your baby's next feeding ❤️</p>`
      );

      feeding.lastReminderSent = now;
      await feeding.save();

      console.log("📧 Feeding reminder sent");
    }
  }
});