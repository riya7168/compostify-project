// Gmail Mailer Utility using Nodemailer
const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL || 'your-email@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
  }
});

const sendEmail = async ({ to, subject, body }) => {
  try {
    console.log('\n=======================================');
    console.log('📧 SENDING EMAIL VIA GMAIL SMTP');
    console.log('=======================================');
    console.log(`TO:      ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`STATUS:  Sending...`);

    const info = await transporter.sendMail({
      from: process.env.GMAIL_EMAIL || 'noreply@compostify.com',
      to: to,
      subject: subject,
      text: body,
      html: `<pre>${body}</pre>`
    });

    console.log(`STATUS:  ✅ Sent successfully`);
    console.log(`RESPONSE ID: ${info.messageId}`);
    console.log('=======================================\n');

    return true;
  } catch (error) {
    console.error('\n=======================================');
    console.error('📧 EMAIL SENDING FAILED');
    console.error('=======================================');
    console.error(`ERROR: ${error.message}`);
    console.error('=======================================\n');

    // Log to console for dev purposes
    console.log('\n⚠️ FALLBACK: Console Email Display:');
    console.log('=======================================');
    console.log(`TO:      ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`BODY:\n${body}`);
    console.log('=======================================\n');

    return false;
  }
};

module.exports = { sendEmail };
