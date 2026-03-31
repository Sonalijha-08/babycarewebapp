require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
// Use timestamp to ensure unique email
const testEmailBase = process.env.EMAIL_USER || 'fit084sonalijha@gmail.com';
const TEST_PASSWORD = 'test123Test!';

(async () => {
  try {
    console.log('\n🚀 FEEDING REMINDER TEST\n');

    // Try login first with your registered email
    const TEST_EMAIL = 'fit084sonalijha@gmail.com';
    let token, userId;
    
    console.log(`1️⃣  Logging in as ${TEST_EMAIL}...`);
    try {
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
      token = loginRes.data.token;
      userId = loginRes.data.user.id;
      console.log('✅ Login successful!');
    } catch (loginErr) {
      console.log('❌ Login failed. Trying registration...');
      const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Sonali Test',
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
      token = registerRes.data.token;
      userId = registerRes.data.user.id;
      console.log('✅ Registered!');
    }

    // 2. Create feeding
    console.log('\n2️⃣  Creating feeding with 2-min initial reminder and 1-min repeat...');
    const now = new Date();
    const futureTime = new Date(now.getTime() + 2 * 60 * 1000);
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = futureTime.toTimeString().substring(0, 5);

    const feedingRes = await axios.post(`${BASE_URL}/feeding/add`, {
      date: dateStr,
      time: timeStr,
      type: 'Breastfeeding',
      amount: 100,
      notes: 'Reminder test',
      setReminder: true,
      reminderIntervalMinutes: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const feedingId = feedingRes.data.feeding._id;
    console.log(`✅ Feeding created! ID: ${feedingId}`);
    console.log(`   Scheduled: ${dateStr} at ${timeStr}`);
    console.log(`   First reminder in ~2 minutes`);
    console.log(`   Will repeat every 1 minute\n`);

    // 3. Monitor for reminders
    console.log('3️⃣  Monitoring for reminders (checking every 30 sec)...');
    console.log('   📧 Check your email: ' + TEST_EMAIL + '\n');

    let checkCount = 0;
    const checker = setInterval(async () => {
      checkCount++;
      try {
        const result = await axios.get(`${BASE_URL}/feeding/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const current = result.data.find(f => f._id === feedingId);
        if (current) {
          const status = `[${new Date().toLocaleTimeString()}] Repeat count: ${current.reminderRepeatCount}`;
          console.log(status);
          if (current.reminderRepeatCount > 0) {
            console.log('✅ REMINDERS SENT! Check your email.\n');
          }
        }
      } catch (e) {
        console.error('Error checking:', e.message);
      }

      if (checkCount >= 6) { // ~3 minutes
        clearInterval(checker);
        console.log('\n✨ Test monitoring complete!');
        console.log('   Check email and server logs for details.');
        process.exit(0);
      }
    }, 30000);

  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error('❌ Error:', msg);
    process.exit(1);
  }
})();
