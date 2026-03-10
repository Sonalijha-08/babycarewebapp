require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'test@babycare.local';
const TEST_PASSWORD = 'Test@123456';

(async () => {
  try {
    console.log('\n🚀 FEEDING REMINDER TEST (Auto-Login)\n');

    // 1. Register a test user
    console.log(`1️⃣  Creating test user ${TEST_EMAIL}...`);
    let token, userId;
    try {
      const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test User Baby Care',
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
      token = registerRes.data.token;
      userId = registerRes.data.user.id;
      console.log('✅ Test user created!');
    } catch (err) {
      console.log('User exists, logging in...');
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
      token = loginRes.data.token;
      userId = loginRes.data.user.id;
      console.log('✅ Logged in!');
    }

    console.log(`   Email: ${TEST_EMAIL}`);
    console.log(`   UserID: ${userId}\n`);

    // 2. Create feeding with reminder
    console.log('2️⃣  Creating feeding with 2-min reminder (repeats every 1 min)...');
    const now = new Date();
    const futureTime = new Date(now.getTime() + 2 * 60 * 1000);
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = futureTime.toTimeString().substring(0, 5);

    const feedingRes = await axios.post(`${BASE_URL}/feeding/add`, {
      date: dateStr,
      time: timeStr,
      type: 'Breastfeeding',
      amount: 100,
      duration: '10 minutes',
      notes: 'Automatic reminder test',
      setReminder: true,
      reminderIntervalMinutes: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const feedingId = feedingRes.data.feeding._id;
    console.log(`✅ Feeding created!`);
    console.log(`   ID: ${feedingId}`);
    console.log(`   Scheduled: ${dateStr} ${timeStr}`);
    console.log(`   First reminder in ~2 minutes`);
    console.log(`   Then repeats every 1 minute\n`);

    // 3. Monitor reminders
    console.log('3️⃣  Monitoring reminders (checking every 30 sec for ~3 minutes)...');
    console.log('   📧 Reminder emails will go to: ' + TEST_EMAIL);
    console.log('   📧 Fallback to: fit084sonalijha@gmail.com\n');
    console.log('   Status updates:\n');

    let checkCount = 0;
    const maxChecks = 6; // ~3 minutes

    const logAndCheck = async () => {
      checkCount++;
      try {
        const result = await axios.get(`${BASE_URL}/feeding/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const current = result.data.find(f => f._id === feedingId);
        if (current) {
          const time = new Date().toLocaleTimeString();
          console.log(`   [${time}] Reminders sent: ${current.reminderRepeatCount}`);
          if (current.reminderRepeatCount > 0) {
            console.log(`   ✅ SUCCESS! Email(s) delivered.\n`);
          }
        }
      } catch (err) {
        console.error('   Check error:', err.message);
      }

      if (checkCount < maxChecks) {
        setTimeout(logAndCheck, 30000);
      } else {
        console.log('\n✨ Monitoring complete!');
        console.log('   📬 Check your email(s) for reminder messages.');
        console.log('   📝 Check server logs for delivery details.\n');
        process.exit(0);
      }
    };

    logAndCheck();

  } catch (error) {
    const msg = error.response?.data?.message || error.response?.data?.error || error.message;
    console.error('\n❌ Error:', msg);
    process.exit(1);
  }
})();
