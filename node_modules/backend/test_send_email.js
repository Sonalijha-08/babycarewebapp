require('dotenv').config();
const { sendEmail } = require('./utils/resendEmail');

(async () => {
  try {
    const to = process.env.EMAIL_USER || 'fit084sonalijha@gmail.com';
    const subject = 'Test: Baby Care email';
    const text = 'This is a test email from Baby Care backend.';
    const html = '<p>This is a <strong>test</strong> email from Baby Care backend.</p>';

    console.log('Sending test email to', to);
    const res = await sendEmail(to, subject, text, html);
    console.log('Send result:', res);
  } catch (err) {
    console.error('Test send failed:', err);
    process.exitCode = 1;
  }
})();
