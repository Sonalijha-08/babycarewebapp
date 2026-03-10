const cron = require('node-cron');
const Feeding = require('../models/feeding');
const DiaperLog = require('../models/diaperlog');
const Vaccination = require('../models/vaccinations');
const User = require('../models/User');
const { sendReminderEmail } = require('./resendEmail');

// Run every minute to check for due reminders
const scheduleFeedingReminders = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Find all feeding logs with reminders enabled
      const feedings = await Feeding.find({
        setReminder: true
      });

      console.log(`[${now.toLocaleTimeString()}] 🔍 Checking ${feedings.length} feeding logs with reminders enabled`);

      for (const feeding of feedings) {
        // Skip if already reached repeat limit
        if (feeding.reminderRepeatLimit && feeding.reminderRepeatCount >= feeding.reminderRepeatLimit) {
          console.log(`[${now.toLocaleTimeString()}] ⏭️ Skipping feeding ${feeding._id} - repeat limit reached (${feeding.reminderRepeatCount}/${feeding.reminderRepeatLimit})`);
          continue;
        }

        // Parse scheduled time
        let scheduledTime;
        try {
          scheduledTime = new Date(`${feeding.date}T${feeding.time}:00`);
        } catch (e) {
          console.error(`[${now.toLocaleTimeString()}] ❌ Invalid date/time for feeding ${feeding._id}: ${feeding.date}T${feeding.time}`);
          continue;
        }

        // Use reminderMinutes for the lead time (when to first send reminder)
        const reminderMinutes = feeding.reminderMinutes || 30;
        const intervalMinutes = feeding.reminderIntervalMinutes || 15;
        
        // Calculate when reminder should be sent (reminderMinutes before scheduled time)
        const reminderTime = new Date(scheduledTime.getTime() - reminderMinutes * 60 * 1000);

        // Calculate time since reminder was last sent
        const lastReminder = feeding.lastReminderSent ? new Date(feeding.lastReminderSent).getTime() : 0;
        const timeSinceLastReminder = now.getTime() - lastReminder;
        
        // Check if it's time to send reminder:
        // 1. First reminder: within window (5 min before to 2 min after scheduled reminder time)
        // 2. Repeated reminders: at least intervalMinutes have passed since last reminder
        const timeSinceReminderTime = now.getTime() - reminderTime.getTime();
        const fiveMinutesMs = 5 * 60 * 1000;
        const twoMinutesMs = 2 * 60 * 1000;
        
        const isFirstReminderWindow = !feeding.reminderSent && timeSinceReminderTime >= -fiveMinutesMs && timeSinceReminderTime <= twoMinutesMs;
        const isRepeatReminderTime = feeding.reminderSent && feeding.reminderRepeatCount > 0 && timeSinceLastReminder >= intervalMinutes * 60 * 1000;
        
        console.log(`[${now.toLocaleTimeString()}] 📋 Feeding ${feeding._id}: scheduledTime=${scheduledTime.toLocaleTimeString()}, reminderTime=${reminderTime.toLocaleTimeString()}, isFirstWindow=${isFirstReminderWindow}, isRepeat=${isRepeatReminderTime}`);
        
        if (isFirstReminderWindow || isRepeatReminderTime) {
          // Find user first to get their email
          const user = await User.findById(feeding.userId);
          
          if (!user) {
            console.error(`[${now.toLocaleTimeString()}] ❌ User not found for feeding ${feeding._id}, userId: ${feeding.userId}`);
            continue;
          }
          
          if (!user.email) {
            console.error(`[${now.toLocaleTimeString()}] ❌ No email found for user ${user._id} (${user.name || 'unnamed'})`);
            continue;
          }
          
          console.log(`[${now.toLocaleTimeString()}] 📧 Attempting to send reminder to: ${user.email} (user: ${user.name || 'unnamed'})`);
          
          try {
            const subject = '🍼 Feeding Reminder';
            const text = `Feeding reminder: ${feeding.type} at ${feeding.time}`;
            const html = `
              <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff5f9; border-radius: 10px;">
                <h2 style="color: #ff5fa2;">🍼 Feeding Reminder</h2>
                <p>Hi ${user.name || 'there'},</p>
                <p>This is a friendly reminder that it's time to feed your baby!</p>
                <div style="background: white; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ff5fa2;">
                  <p style="margin: 5px 0;"><strong>⏰ Scheduled Time:</strong> ${feeding.time}</p>
                  <p style="margin: 5px 0;"><strong>🍼 Type:</strong> ${feeding.type}</p>
                </div>
                <p>Have everything ready for a smooth feeding! 💕</p>
              </div>
            `;

            await sendReminderEmail(user.email, subject, text, html);
            await Feeding.findByIdAndUpdate(feeding._id, {
              $inc: { reminderRepeatCount: 1 },
              $set: { reminderSent: true, lastReminderSent: new Date() }
            });
            console.log(`[${now.toLocaleTimeString()}] ✅ Feeding reminder SENT successfully to ${user.email} for feeding ${feeding._id}`);
          } catch (err) {
            console.error(`[${now.toLocaleTimeString()}] ❌ FAILED to send feeding reminder to ${user.email}:`, err.message);
          }
        }
      }

      // Similar logic for diaper logs
      const diapers = await DiaperLog.find({
        setReminder: true
      });

      console.log(`[${now.toLocaleTimeString()}] 🔍 Checking ${diapers.length} diaper logs with reminders enabled`);

      for (const diaper of diapers) {
        // Skip if already reached repeat limit
        if (diaper.reminderRepeatLimit && diaper.reminderRepeatCount >= diaper.reminderRepeatLimit) {
          console.log(`[${now.toLocaleTimeString()}] ⏭️ Skipping diaper ${diaper._id} - repeat limit reached (${diaper.reminderRepeatCount}/${diaper.reminderRepeatLimit})`);
          continue;
        }

        let scheduledTime;
        try {
          scheduledTime = new Date(`${diaper.date}T${diaper.time}:00`);
        } catch (e) {
          console.error(`[${now.toLocaleTimeString()}] ❌ Invalid date/time for diaper ${diaper._id}: ${diaper.date}T${diaper.time}`);
          continue;
        }

        const reminderMinutes = diaper.reminderMinutes || 30;
        const intervalMinutes = diaper.reminderIntervalMinutes || 15;
        const reminderTime = new Date(scheduledTime.getTime() - reminderMinutes * 60 * 1000);

        // Calculate time since reminder was last sent
        const lastReminder = diaper.lastReminderSent ? new Date(diaper.lastReminderSent).getTime() : 0;
        const timeSinceLastReminder = now.getTime() - lastReminder;
        
        const timeSinceReminderTime = now.getTime() - reminderTime.getTime();
        const fiveMinutesMs = 5 * 60 * 1000;
        const twoMinutesMs = 2 * 60 * 1000;
        
        const isFirstReminderWindow = !diaper.reminderSent && timeSinceReminderTime >= -fiveMinutesMs && timeSinceReminderTime <= twoMinutesMs;
        const isRepeatReminderTime = diaper.reminderSent && diaper.reminderRepeatCount > 0 && timeSinceLastReminder >= intervalMinutes * 60 * 1000;

        console.log(`[${now.toLocaleTimeString()}] 📋 Diaper ${diaper._id}: scheduledTime=${scheduledTime.toLocaleTimeString()}, reminderTime=${reminderTime.toLocaleTimeString()}, isFirstWindow=${isFirstReminderWindow}, isRepeat=${isRepeatReminderTime}`);

        if (isFirstReminderWindow || isRepeatReminderTime) {
          const user = await User.findById(diaper.userId);
          
          if (!user) {
            console.error(`[${now.toLocaleTimeString()}] ❌ User not found for diaper ${diaper._id}, userId: ${diaper.userId}`);
            continue;
          }
          
          if (!user.email) {
            console.error(`[${now.toLocaleTimeString()}] ❌ No email found for user ${user._id} (${user.name || 'unnamed'})`);
            continue;
          }
          
          console.log(`[${now.toLocaleTimeString()}] 📧 Attempting to send diaper reminder to: ${user.email} (user: ${user.name || 'unnamed'})`);
          
          try {
            const subject = '👶 Diaper Change Reminder';
            const text = `Diaper change reminder: ${diaper.type} at ${diaper.time}`;
            const html = `
              <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff5f9; border-radius: 10px;">
                <h2 style="color: #ff5fa2;">👶 Diaper Change Reminder</h2>
                <p>Hi ${user.name || 'there'},</p>
                <p>This is a friendly reminder that it's time to check baby's diaper!</p>
                <div style="background: white; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ff5fa2;">
                  <p style="margin: 5px 0;"><strong>⏰ Scheduled Time:</strong> ${diaper.time}</p>
                  <p style="margin: 5px 0;"><strong>👶 Type:</strong> ${diaper.type}</p>
                </div>
                <p>Have everything ready! 💕</p>
              </div>
            `;

            await sendReminderEmail(user.email, subject, text, html);
            await DiaperLog.findByIdAndUpdate(diaper._id, {
              $inc: { reminderRepeatCount: 1 },
              $set: { reminderSent: true, lastReminderSent: new Date() }
            });
console.log(`[${now.toLocaleTimeString()}] ✅ Diaper reminder SENT successfully to ${user.email} for diaper ${diaper._id}`);
          } catch (err) {
            console.error(`[${now.toLocaleTimeString()}] ❌ FAILED to send diaper reminder to ${user.email}:`, err.message);
          }
        }
      }

      // Vaccination reminder logic - sends reminder 1 day before next vaccination date
      const vaccinations = await Vaccination.find({
        reminderEnabled: true,
        reminderSent: false
      });

      console.log(`[${now.toLocaleTimeString()}] 🔍 Checking ${vaccinations.length} vaccinations with reminders enabled`);

      for (const vaccination of vaccinations) {
        if (!vaccination.nextVaccinationDate) {
          console.log(`[${now.toLocaleTimeString()}] ⏭️ Skipping vaccination ${vaccination._id} - no next vaccination date set`);
          continue;
        }

        // Parse the next vaccination date
        let nextVaccDate;
        try {
          nextVaccDate = new Date(vaccination.nextVaccinationDate);
          nextVaccDate.setHours(0, 0, 0, 0);
        } catch (e) {
          console.error(`[${now.toLocaleTimeString()}] ❌ Invalid next vaccination date for ${vaccination._id}: ${vaccination.nextVaccinationDate}`);
          continue;
        }

        // Calculate the reminder date (1 day before next vaccination)
        const reminderDate = new Date(nextVaccDate);
        reminderDate.setDate(reminderDate.getDate() - 1);
        reminderDate.setHours(9, 0, 0, 0); // Set reminder time to 9 AM

        // Calculate date-only comparison (today without time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const reminderDateOnly = new Date(reminderDate);
        reminderDateOnly.setHours(0, 0, 0, 0);

        // Check if today is the reminder date (1 day before vaccination)
        const isReminderDay = today.getTime() === reminderDateOnly.getTime();

        console.log(`[${now.toLocaleTimeString()}] 📋 Vaccination ${vaccination._id}: nextVaccDate=${nextVaccDate.toLocaleDateString()}, reminderDate=${reminderDate.toLocaleDateString()}, today=${today.toLocaleDateString()}, isReminderDay=${isReminderDay}`);

        if (isReminderDay) {
          // Find user to get their email
          const user = await User.findById(vaccination.userId);
          
          if (!user) {
            console.error(`[${now.toLocaleTimeString()}] ❌ User not found for vaccination ${vaccination._id}, userId: ${vaccination.userId}`);
            continue;
          }
          
          if (!user.email) {
            console.error(`[${now.toLocaleTimeString()}] ❌ No email found for user ${user._id} (${user.name || 'unnamed'})`);
            continue;
          }
          
          console.log(`[${now.toLocaleTimeString()}] 📧 Attempting to send vaccination reminder to: ${user.email} (user: ${user.name || 'unnamed'})`);
          
          try {
            const subject = '💉 Vaccination Reminder - Tomorrow!';
            const text = `Reminder: ${vaccination.vaccineName} vaccination is scheduled for tomorrow (${vaccination.nextVaccinationDate})`;
            const html = `
              <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff5f9; border-radius: 10px;">
                <h2 style="color: #ff5fa2;">💉 Vaccination Reminder</h2>
                <p>Hi ${user.name || 'there'},</p>
                <p>This is a friendly reminder that your baby's next vaccination is <strong>tomorrow</strong>!</p>
                <div style="background: white; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ff5fa2;">
                  <p style="margin: 5px 0;"><strong>💉 Vaccine:</strong> ${vaccination.vaccineName}</p>
                  <p style="margin: 5px 0;"><strong>📅 Vaccination Date:</strong> ${vaccination.nextVaccinationDate}</p>
                  ${vaccination.notes ? `<p style="margin: 5px 0;"><strong>📝 Notes:</strong> ${vaccination.notes}</p>` : ''}
                </div>
                <p>Please make sure to prepare everything for tomorrow's appointment! 💕</p>
              </div>
            `;

            await sendReminderEmail(user.email, subject, text, html);
            await Vaccination.findByIdAndUpdate(vaccination._id, {
              $set: { reminderSent: true }
            });
            console.log(`[${now.toLocaleTimeString()}] ✅ Vaccination reminder SENT successfully to ${user.email} for vaccination ${vaccination._id}`);
          } catch (err) {
            console.error(`[${now.toLocaleTimeString()}] ❌ FAILED to send vaccination reminder to ${user.email}:`, err.message);
          }
        }
      }
    } catch (error) {
      console.error('Error in reminder scheduler:', error);
    }
  });

  console.log('✅ Reminder scheduler started (checks every minute)');
};

module.exports = scheduleFeedingReminders;
