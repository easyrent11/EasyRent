const nodemailer = require("nodemailer");

const sendOrderEmail = async (recipientEmail, body, subject) => {
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
      subject: subject,
      text:body,
    };
    const info = await transporter.sendMail(mailOptions);
    return info
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendOrderEmail;
