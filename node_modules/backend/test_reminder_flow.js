require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'fit084sonalijha@gmail.com';
const TEST_PASSWORD = 'testpass123';

(async () => {
  try {
    console.log('📋 Starting Feeding Reminder Test Flow...\n');

    // 1. Register or login
    console.log('1️⃣  Attempting to login...');
    let token, userId;
    try {
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
      token = loginRes.data.token;
      userId = loginRes.data.user.id;
      console.log('✅ Logged in successfully');
      console.log(`   Token: ${token.substring(0, 20)}...`);
      console.log(`   User ID: ${userId}\n`);
    } catch (err) {
      console.log('⚠️  Login failed, attempting to register...');
      const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test User',
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
      token = registerRes.data.token;
      userId = registerRes.data.user.id;
      console.log('✅ Registered and logged in');
      console.log(`   Token: ${token.substring(0, 20)}...`);
      console.log(`   User ID: ${userId}\n`);
    }

    // 2. Create a feeding with reminder 2 minutes from now
    console.log('2️⃣  Creating feeding with 2-minute initial reminder...');
    const now = new Date();
    const futureTime = new Date(now.getTime() + 2 * 60 * 1000);
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = futureTime.toTimeString().substring(0, 5); // HH:MM

    const feedingRes = await axios.post(`${BASE_URL}/feeding/add`, {
      date: dateStr,
      time: timeStr,
      type: 'Breastfeeding',
      amount: 100,
      notes: 'Automatic test feeding with reminder',
      setReminder: true,
      reminderIntervalMinutes: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const feedingId = feedingRes.data.feeding._id;
    console.log('✅ Feeding created');
    console.log(`   Feeding ID: ${feedingId}`);
    console.log(`   Scheduled time: ${timeStr}`);
    console.log(`   First reminder at: ~${futureTime.toTimeString().substring(0, 5)}`);
    console.log(`   Repeat interval: 1 minute\n`);

    // 3. List feedings to verify
    console.log('3️⃣  Fetching all feedings for user...');
    const feedingsRes = await axios.get(`${BASE_URL}/feeding/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Retrieved ${feedingsRes.data.length} feeding(s)`);
    const created = feedingsRes.data.find(f => f._id === feedingId);
    if (created) {
      console.log(`   Latest feeding: "${created.type}" at ${created.time}`);
      console.log(`   Set Reminder: ${created.setReminder}`);
      console.log(`   Reminder Interval: ${created.reminderIntervalMinutes} min`);
      console.log(`   Repeat Count: ${created.reminderRepeatCount}\n`);
    }

    // 4. Wait and check for reminder sent
    console.log('4️⃣  Waiting for reminders (~2+ minutes)...');
    console.log('   Check your email inbox for the reminder(s)\n');
    console.log('🎯 Test running. Look for emails from: Baby Care <onboarding@resend.dev>');
    console.log('   or from: ' + process.env.EMAIL_USER + '\n');

    // Keep checking every 30 seconds for updates
    let checksRemaining = 8; // ~4 minutes
    const checkInterval = setInterval(async () => {
      try {
        const updated = await axios.get(`${BASE_URL}/feeding/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const current = updated.data.find(f => f._id === feedingId);
        if (current) {
          console.log(`   [${new Date().toLocaleTimeString()}] Repeat count: ${current.reminderRepeatCount}, Sent: ${current.reminderSent}`);
          if (current.reminderRepeatCount > 0) {
            console.log(`   ✅ Reminders have been sent! (${current.reminderRepeatCount} so far)`);
          }
        }
        checksRemaining--;
        if (checksRemaining <= 0) {
          clearInterval(checkInterval);
          console.log('\n✨ Test complete. Check your email and the server logs.');
          process.exit(0);
        }
      } catch (e) {
        console.error('Error checking status:', e.message);
      }
    }, 30000);

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.error || error.message);
    process.exit(1);
  }
})();
