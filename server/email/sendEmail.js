// sendEmail.js
const nodemailer = require("nodemailer");
const tempPasswordGenerator = require("../email/RandomPasswordGenerator");

// generating a random secure password from the helper function.
const temporaryPassword = tempPasswordGenerator();

const sendEmail = async (recipientEmail) => {
  // defining the mail body.
  const emailBody = `
    Hello [${recipientEmail}],

    We received a request to reset the password for your account. To complete the process, please use the following temporary password:

    ${temporaryPassword}

    For security reasons, we recommend changing your password after logging in. You can do this by navigating to your account profile and selecting the option to update your password.

    If you did not request a password reset, please ignore this email. Your account remains secure, and no changes have been made.

    Thank you,
    [EasyRent]
    `;
  // creating a mail transport and giving the mail details.
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    // mail details object
    const mailOptions = {
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: "Password Reset",
      text: emailBody,
    };

    const info = await transporter.sendMail(mailOptions);
    return temporaryPassword; // returning the temporary password
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
