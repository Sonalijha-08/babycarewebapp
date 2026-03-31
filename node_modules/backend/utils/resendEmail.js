const { Resend } = require("resend");

const resendApiKey = process.env.RESEND_API_KEY;
console.log('[Email] Resend API Key present:', !!resendApiKey, resendApiKey ? resendApiKey.substring(0, 10) + '...' : 'none');
const resend = new Resend(resendApiKey);

// Always use SMTP for sending emails - more reliable for personal Gmail accounts
const useSMTP = true;

const sendEmail = async (to, subject, text, html) => {
  console.log('[Email] ========================================');
  console.log('[Email] Attempting to send email to:', to);
  console.log('[Email] Subject:', subject);
  console.log('[Email] Using method:', useSMTP ? 'SMTP' : 'Resend API');
  console.log('[Email] ========================================');
  
  // Always use SMTP for reliability with personal Gmail accounts
  if (useSMTP) {
    try {
      const nodemailer = require('nodemailer');
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
      const secure = smtpPort === 465;
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASSWORD;

      console.log('[Email] SMTP Config - Host:', smtpHost, 'Port:', smtpPort, 'User:', user ? 'set' : 'NOT SET');
      
      if (!user || !pass) {
        console.error('[Email] SMTP unavailable: EMAIL_USER or EMAIL_PASSWORD not set in .env');
        throw new Error('SMTP credentials not configured');
      }

      const transporterOptions = {
        host: smtpHost,
        port: smtpPort,
        secure,
        auth: { user, pass },
      };

      if (process.env.SMTP_ALLOW_SELF_SIGNED === 'true') {
        transporterOptions.tls = { rejectUnauthorized: false };
      }

      const transporter = nodemailer.createTransport(transporterOptions);

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'Baby Care'} <${user}>`,
        to,
        subject,
        text,
        html,
      };

      console.log('[Email] Sending via SMTP to:', to);
      const info = await transporter.sendMail(mailOptions);
      console.log('[Email] ✅ SMTP email sent successfully!');
      console.log('[Email] SMTP info:', info);
      return { smtp: info };
    } catch (smtpErr) {
      console.error('[Email] ❌ SMTP failed:', smtpErr.message);
      throw smtpErr;
    }
  }

  // Original Resend logic (kept as fallback)
  try {
    const res = await resend.emails.send({
      from: "Baby Care <jhasonali208@gmail.com>",
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
    console.log('[Email] Resend API response:', JSON.stringify(res, null, 2));

    if (res && res.error) {
      const msg = res.error.message || '';
      console.error('[Email] Resend returned error object:', res.error);
      const err = new Error(msg);
      err._resendResponse = res;
      throw err;
    }

    console.log('[Email] ✅ Email sent successfully via Resend!');
    return res;
  } catch (err) {
    console.error('[Email] ❌ Error in sendEmail (Resend):', err.message);
    
    // Try SMTP fallback
    console.log('[Email] Trying SMTP fallback...');
    try {
      const nodemailer = require('nodemailer');
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
      const secure = smtpPort === 465;
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASSWORD;

      const transporterOptions = {
        host: smtpHost,
        port: smtpPort,
        secure,
        auth: { user, pass },
      };

      const transporter = nodemailer.createTransport(transporterOptions);
      const info = await transporter.sendMail({
        from: `${process.env.FROM_NAME || 'Baby Care'} <${user}>`,
        to,
        subject,
        text,
        html,
      });
      console.log('[Email] ✅ SMTP fallback email sent successfully!');
      return { smtp: info };
    } catch (smtpErr) {
      console.error('[Email] ❌ SMTP fallback also failed:', smtpErr);
      throw smtpErr;
    }
  }
};

// Export as both sendEmail and sendReminderEmail for compatibility
module.exports = {
  sendEmail,
  sendReminderEmail: sendEmail,
};
