require('dotenv').config();
const { sendReminderEmail } = require('./utils/resendEmail');

(async () => {
  try {
    console.log('Testing SMTP with ALLOW_SELF_SIGNED =', process.env.SMTP_ALLOW_SELF_SIGNED);
    await sendReminderEmail(
      'fit084sonalijha@gmail.com',
      '🧪 Test Email - SMTP Config',
      'Test email',
      '<h1>✅ SMTP Fallback Working!</h1>'
    );
    console.log('✅ Test email sent successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test email failed:', err.message);
    process.exit(1);
  }
})();
