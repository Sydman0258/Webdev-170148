// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ name, email, message }) => {
  // Setup your transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,     
      pass: process.env.EMAIL_PASS       
    }
  });

  // Email options
  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL,      // Your inbox to receive the messages
    subject: `New Message from ${name}`,
    text: `
From: ${name}
Email: ${email}

Message:
${message}
    `
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
