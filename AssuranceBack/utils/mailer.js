const nodemailer = require('nodemailer');

// Replace these values with your email service credentials
const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., Gmail, Outlook
    auth: {
      user: 'amine.ouledhssan98@gmail.com', // Your email address
      pass: 'vdlv oxpt nrqf sgsf', // Your email password or app password
  
    },
    secure: true,
  });
  
  // Function to send an email
  const sendEmail = async (to, subject, html) => {
    try {
      const mailOptions = {
        from: 'amine.ouledhssan98@gmail.com',
        to,
        subject,
        html, // HTML content
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}: ${info.response}`);
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
    }
  };
  
  module.exports = sendEmail;
  