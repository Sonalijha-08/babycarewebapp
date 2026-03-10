require('dotenv').config();
const mongoose = require('mongoose');
const Feeding = require('./models/feeding');
const User = require('./models/user');
const { sendReminderEmail } = require('./utils/resendEmail');

const MONGO_URI = process.env.MONGO_URI;

(async () => {
  try {
    console.log('\n=== DIRECT REMINDER TEST ===\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create a test user
    let user = await User.findOne({ email: 'test@babycare.local' });
    if (!user) {
      const bcrypt = require('bcrypt');
      user = new User({
        name: 'Test User',
        email: 'test@babycare.local',
        password: await bcrypt.hash('Test@123456', 12)
      });
      await user.save();
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user found');
    }

    // Create a feeding with reminder in 15 seconds
    const now = new Date();
    const futureTime = new Date(now.getTime() + 15 * 1000); // 15 seconds
    
    const feeding = new Feeding({
      userId: user._id,
      date: now.toISOString().split('T')[0],
      time: futureTime.toTimeString().substring(0, 5),
      type: 'Breastfeeding',
      amount: 100,
      notes: 'Direct test - reminder in 15 seconds',
      setReminder: true,
      reminderIntervalMinutes: 0.25, // 15 seconds for testing
      reminderRepeatLimit: 3
    });

    await feeding.save();
    console.log(`✅ Feeding created! ID: ${feeding._id}`);
    console.log(`   Test email: ${user.email}`);
    console.log(`   Scheduled: ${futureTime.toTimeString()}`);
    console.log(`   First reminder in 15 seconds\n`);

    // Schedule the reminder (same logic as controller)
    const intervalMinutes = 0.25;
    const intervalMs = intervalMinutes * 60 * 1000; // 15 seconds

    let scheduledTime;
    try {
      scheduledTime = new Date(`${feeding.date}T${feeding.time}:00`);
    } catch (e) {
      scheduledTime = new Date();
    }

    const leadMs = intervalMs;
    let initialDelay = scheduledTime.getTime() - leadMs - Date.now();
    console.log(`Initial delay: ${initialDelay}ms`);
    if (initialDelay < 0) initialDelay = 0;

    console.log(`⏳ Waiting ${initialDelay / 1000} seconds for first reminder...\n`);

    const sendReminder = async () => {
      const currentFeeding = await Feeding.findById(feeding._id);
      if (!currentFeeding) return;
      if (currentFeeding.reminderSent || currentFeeding.reminderRepeatCount >= currentFeeding.reminderRepeatLimit) return;

      const currentUser = await User.findById(currentFeeding.userId);
      if (currentUser && currentUser.email) {
        const subject = '🍼 Feeding Reminder';
        const text = `Feeding reminder: ${currentFeeding.type} at ${currentFeeding.time}`;
        const html = `<h2>🍼 Feeding Reminder</h2><p>Time to feed baby!</p>`;

        console.log(`[${new Date().toLocaleTimeString()}] Sending reminder...`);
        try {
          await sendReminderEmail(currentUser.email, subject, text, html);
          console.log(`✅ Reminder ${currentFeeding.reminderRepeatCount + 1} sent to ${currentUser.email}`);
          
          await Feeding.findByIdAndUpdate(feeding._id, {
            $inc: { reminderRepeatCount: 1 },
            lastReminderSent: new Date()
          });
        } catch (err) {
          console.error(`❌ Send failed:`, err.message);
        }
      }
    };

    const startRepeated = () => {
      const intervalId = setInterval(async () => {
        const current = await Feeding.findById(feeding._id);
        if (!current) { clearInterval(intervalId); return; }
        if (current.reminderSent || current.reminderRepeatCount >= current.reminderRepeatLimit) {
          clearInterval(intervalId);
          console.log(`\n✨ All reminders complete (sent: ${current.reminderRepeatCount})`);
          setTimeout(() => mongoose.connection.close(), 2000);
          return;
        }
        await sendReminder();
      }, intervalMs);
    };

    setTimeout(startRepeated, initialDelay);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
