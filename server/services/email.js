const nodemailer = require("nodemailer");
require('dotenv').config();


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.VERIFCATION_EMAIL,
    pass: process.env.VERIFCATION_PASSWORD,
  },
});

// Function to send verification code email
const sendVerificationCode = (email, verificationCode, callback) => {
  const mailOptions = {
    from: process.env.VERIFCATION_EMAIL,
    to: email,
    subject: "Account Verification",
    text: `Your verification code is: ${verificationCode}. Please enter this code to complete your registration.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending verification email:", error);
      callback(error);
    } else {
      console.log("Verification email sent successfully");
      callback(null);
    }
  });
};

module.exports = {
  sendVerificationCode,
};
