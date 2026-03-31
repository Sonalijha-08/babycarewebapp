require('dotenv').config();

const base = 'http://localhost:5000';
const email = process.env.TEST_EMAIL || process.env.EMAIL_USER || 'fit084sonalijha@gmail.com';
const password = 'Testpass123!';

function nowDate() {
  const d = new Date();
  return d.toISOString().slice(0,10);
}
function nowTime() {
  const d = new Date();
  return d.toTimeString().slice(0,5);
}

(async () => {
  try {
    console.log('Using test email:', email);

    // Register (ignore errors)
    try {
      const regRes = await fetch(base + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Auto Tester', email, password })
      });
      const regJson = await regRes.json().catch(()=>null);
      console.log('Register response:', regRes.status, regJson);
    } catch (e) {
      console.error('Register failed:', e.message || e);
    }

    // Login
    const loginRes = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginJson = await loginRes.json();
    if (!loginJson.token) {
      console.error('Login failed:', loginJson);
      process.exit(1);
    }
    const token = loginJson.token;
    console.log('Login success. Token length:', token.length);

    // Add feeding with 2 min initial delay and 1 min repeat
    const addRes = await fetch(base + '/api/feeding/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({
        date: nowDate(),
        time: nowTime(),
        type: 'TestFeeding',
        amount: 0,
        notes: 'Auto test: 2-min initial, 1-min repeat',
        setReminder: true,
        reminderMinutes: 2,
        reminderIntervalMinutes: 1,
        reminderRepeatLimit: 5
      })
    });
    const addJson = await addRes.json();
    console.log('Add feeding response:', addRes.status, addJson);
    if (addJson && addJson.feeding && addJson.feeding._id) {
      console.log('Feeding created with id:', addJson.feeding._id);
    }

    console.log('Test flow complete. Waiting for reminders to appear in server logs...');
  } catch (err) {
    console.error('Test flow error:', err);
  }
})();
