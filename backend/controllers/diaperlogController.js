const DiaperLog = require("../models/diaperlog");
const User = require("../models/user");
const { sendReminderEmail } = require("../utils/resendEmail");

// IMPORTANT: Reminders are now handled by the persistent cron job in utils/reminderScheduler.js
// This runs every minute and checks for due reminders in the database
// Reminders persist even if the server restarts!

// Add a new diaper log
const addDiaperLog = async (req, res) => {
  try {
    const { date, time, type, notes, setReminder, reminderMinutes, reminderIntervalMinutes, reminderRepeatLimit } = req.body;

    const newLog = new DiaperLog({
      userId: req.user.id, // From auth middleware
      date,
      time,
      type,
      notes,
      setReminder: setReminder || false,
      reminderMinutes: reminderMinutes || 5,
      reminderIntervalMinutes: reminderIntervalMinutes || 15,
      reminderRepeatCount: 0,
      reminderRepeatLimit: reminderRepeatLimit || 96,
      reminderSent: false,
      lastReminderSent: null,
    });

    await newLog.save();

    // Send immediate notification email upon creating a diaper log
    try {
      const notifUser = await User.findById(req.user.id);
      if (notifUser && notifUser.email) {
        const subjectNew = '👶 New Diaper Change Recorded';
        const textNew = `A new diaper change has been recorded: ${type} at ${time}`;
        const htmlNew = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h3 style="color:#ff5fa2;">👶 New Diaper Change</h3>
            <p>Hi ${notifUser.name || 'there'},</p>
            <p>A new diaper change was just recorded.</p>
            <ul>
              <li><strong>Time:</strong> ${time}</li>
              <li><strong>Type:</strong> ${type}</li>
              <li><strong>Notes:</strong> ${notes || 'N/A'}</li>
            </ul>
          </div>
        `;

        await sendReminderEmail(notifUser.email, subjectNew, textNew, htmlNew);
      }
    } catch (err) {
      console.error('Error sending immediate diaper notification:', err);
    }

    // REMINDER SCHEDULING is now handled by the persistent cron job in reminderScheduler.js
    // The cron job checks for reminders every minute and sends them automatically
    // No need for setTimeout here - reminders persist even if server restarts!

    res.status(201).json({ success: true, message: "Diaper log recorded successfully!", data: newLog });
  } catch (error) {
    console.error("Error adding diaper log:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get diaper logs by user
const getDiaperLogs = async (req, res) => {
  try {
    const diaperLogs = await DiaperLog.find({
      userId: req.params.userId,
    }).sort({ date: -1, time: -1 });

    res.json(diaperLogs);
  } catch (error) {
    console.error("Error fetching diaper logs:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a diaper log
const deleteDiaperLog = async (req, res) => {
  try {
    const diaperLog = await DiaperLog.findById(req.params.id);
    if (!diaperLog) return res.status(404).json({ message: "Diaper log not found" });

    if (diaperLog.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await DiaperLog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Diaper log deleted successfully" });
  } catch (error) {
    console.error("Error deleting diaper log:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addDiaperLog,
  getDiaperLogs,
  deleteDiaperLog
};
