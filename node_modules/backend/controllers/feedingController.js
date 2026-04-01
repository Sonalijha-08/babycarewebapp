const Feeding = require("../models/feeding");
const User = require("../models/user");
const { sendReminderEmail } = require("../utils/resendEmail");

// IMPORTANT: Reminders are now handled by the persistent cron job in utils/reminderScheduler.js
// This runs every minute and checks for due reminders in the database
// Reminders persist even if the server restarts!

// Add a new feeding
const addFeeding = async (req, res) => {
  try {
    const { sendValidationErrors } = require('../middleware/validators');
    if (sendValidationErrors(req, res)) return;

    const { date, time, type, amount, duration, side, notes, setReminder, reminderMinutes, reminderIntervalMinutes, reminderRepeatLimit } = req.body;

    const newFeeding = new Feeding({
      userId: req.user.id, // From auth middleware
      date,
      time,
      type,
      amount: amount || 0,
      duration: duration || "",
      side: side || "",
      notes: notes || "",
      setReminder: setReminder || false,
      reminderMinutes: reminderMinutes,
      reminderIntervalMinutes: reminderIntervalMinutes,
      reminderRepeatCount: 0,
      reminderRepeatLimit: reminderRepeatLimit || 96,
      reminderSent: false,
      lastReminderSent: null,
    });

    await newFeeding.save();

    // Send immediate notification email upon creating a feeding log
    try {
      const notifUser = await User.findById(req.user.id);
      if (notifUser && notifUser.email) {
        const subjectNew = '🍼 New Feeding Recorded';
        const textNew = `A new feeding has been recorded: ${type} - ${amount}ml at ${time}`;
        const htmlNew = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h3 style="color:#ff5fa2;">🍼 New Feeding</h3>
            <p>Hi ${notifUser.name || 'there'},</p>
            <p>A new feeding was just recorded.</p>
            <ul>
              <li><strong>Time:</strong> ${time}</li>
              <li><strong>Type:</strong> ${type}</li>
              <li><strong>Amount:</strong> ${amount || 0} ml</li>
              <li><strong>Duration:</strong> ${duration || 'N/A'}</li>
              <li><strong>Notes:</strong> ${notes || 'N/A'}</li>
            </ul>
          </div>
        `;

        await sendReminderEmail(notifUser.email, subjectNew, textNew, htmlNew);
      }
    } catch (err) {
      console.error('Error sending immediate feeding notification:', err);
    }

    // REMINDER SCHEDULING is now handled by the persistent cron job in reminderScheduler.js
    // The cron job checks for reminders every minute and sends them automatically
    // No need for setTimeout here - reminders persist even if server restarts!

    res.status(201).json({ success: true, message: "Feeding logged successfully!", data: newFeeding });
  } catch (error) {
    console.error("Error adding feeding:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get feeding logs by user
const getFeedings = async (req, res) => {
  try {
    const feedings = await Feeding.find({
      userId: req.params.userId,
    }).sort({ date: -1, time: -1 });

    res.json(feedings);
  } catch (error) {
    console.error("Error fetching feedings:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a feeding
const deleteFeeding = async (req, res) => {
  try {
    const feeding = await Feeding.findById(req.params.id);
    if (!feeding) return res.status(404).json({ message: "Feeding not found" });

    if (feeding.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Feeding.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Feeding deleted successfully" });
  } catch (error) {
    console.error("Error deleting feeding:", error);
    res.status(500).json({ error: error.message });
  }
};

// Send feeding reminder email manually
const sendFeedingReminder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User email not found" });
    }

    const subject = '🍼 Feeding Reminder';
    const text = 'This is a reminder to log your baby\'s feeding.';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff5f9; border-radius: 10px;">
        <h2 style="color: #ff5fa2;">🍼 Feeding Reminder</h2>
        <p>Hi ${user.name || 'there'},</p>
        <p>This is a friendly reminder to log your baby's feeding.</p>
        <p>Don't forget to record all feedings to track your baby's patterns! 💕</p>
      </div>
    `;

    await sendReminderEmail(user.email, subject, text, html);
    res.json({ success: true, message: "Reminder email sent successfully" });
  } catch (error) {
    console.error("Error sending feeding reminder:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update reminder settings for an existing feeding
const updateReminder = async (req, res) => {
  try {
    const feedingId = req.params.id;
    const { setReminder, reminderMinutes, reminderIntervalMinutes, reminderRepeatLimit, reminderSent } = req.body;

    const feeding = await Feeding.findById(feedingId);
    if (!feeding) return res.status(404).json({ message: 'Feeding not found' });
    if (feeding.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    // Update fields
    if (typeof setReminder === 'boolean') feeding.setReminder = setReminder;
    if (typeof reminderMinutes === 'number') feeding.reminderMinutes = reminderMinutes;
    if (typeof reminderIntervalMinutes === 'number') feeding.reminderIntervalMinutes = reminderIntervalMinutes;
    if (typeof reminderRepeatLimit === 'number') feeding.reminderRepeatLimit = reminderRepeatLimit;
    if (typeof reminderSent === 'boolean') feeding.reminderSent = reminderSent;

    // reset repeat count if changing reminder settings
    if (typeof reminderIntervalMinutes === 'number' || typeof reminderMinutes === 'number') {
      feeding.reminderRepeatCount = 0;
      feeding.lastReminderSent = null;
    }

    await feeding.save();

    // If reminders enabled, schedule same in-memory timers as addFeeding
    if (feeding.setReminder && !feeding.reminderSent) {
      const intervalMinutes = feeding.reminderIntervalMinutes || 15;
      const intervalMs = intervalMinutes * 60 * 1000;

      // compute scheduled time
      let scheduledTime;
      try {
        scheduledTime = new Date(`${feeding.date}T${feeding.time}:00`);
      } catch (e) {
        scheduledTime = new Date();
      }

      const leadMs = (feeding.reminderIntervalMinutes || intervalMinutes) * 60 * 1000;
      let initialDelay = scheduledTime.getTime() - leadMs - Date.now();
      if (initialDelay < 0) initialDelay = 0;

      const startRepeated = () => {
        const intervalId = setInterval(async () => {
          try {
            const currentFeeding = await Feeding.findById(feeding._id);
            if (!currentFeeding) { clearInterval(intervalId); return; }
            if (currentFeeding.reminderSent || (currentFeeding.reminderRepeatLimit && currentFeeding.reminderRepeatCount >= currentFeeding.reminderRepeatLimit)) { clearInterval(intervalId); return; }

            const user = await User.findById(currentFeeding.userId);
            if (user && user.email) {
              const subject = '🍼 Feeding Reminder';
              const text = `Feeding reminder: ${currentFeeding.type} - ${currentFeeding.amount || 0}ml at ${currentFeeding.time}`;
              const html = `<div style="font-family: Arial, sans-serif; padding: 20px; background: #fff5f9; border-radius: 10px;">\n  <h2 style=\\"color: #ff5fa2;\\">🍼 Feeding Reminder</h2>\n  <p>Hi ${user.name || 'there'},</p>\n  <p>This is a friendly reminder that it's time to feed your baby!</p>\n  <div style=\\"background: white; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ff5fa2;\\">\n    <p style=\\"margin: 5px 0;\\"><strong>⏰ Scheduled Time:</strong> ${currentFeeding.time}</p>\n    <p style=\\"margin: 5px 0;\\"><strong>🍼 Type:</strong> ${currentFeeding.type}</p>\n    <p style=\\"margin: 5px 0;\\"><strong>📊 Amount:</strong> ${currentFeeding.amount || 0} ml</p>\n  </div>\n  <p>Have everything ready for a smooth feeding! 💕</p>\n</div>`;

              await sendReminderEmail(user.email, subject, text, html);
              await Feeding.findByIdAndUpdate(feeding._id, { $inc: { reminderRepeatCount: 1 }, lastReminderSent: new Date() });
              console.log(`Updated reminder sent for feeding ${feeding._id}`);
            }
          } catch (err) {
            console.error('Error in updated reminder interval:', err);
          }
        }, intervalMs);
      };

      setTimeout(startRepeated, initialDelay);
    }

    res.json({ success: true, feeding });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addFeeding,
  getFeedings,
  deleteFeeding,
  sendFeedingReminder,
  updateReminder
};
