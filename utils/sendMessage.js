const nodemailer = require("nodemailer");

// Creating the nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
  auth: {
    user: process.env.USER_E,
    pass: process.env.E_PASS,
  },
});

// verify transporter connection configuration
transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

// Contact us controller
const receiveMail = (req, res) => {
  const {name, email, phone, message} = req.body;

  const mailConfig = {
    from: email,
    to: process.env.USER_E,
    subject: `Product Inquiry From ${name}`,
    body: `${message} \n I receive calls or SMS at ${phone} `,
  };

  transporter
    .sendMail(mailConfig)
    .then((rs) => {
      return res.status(200).send("Email successfully sent to recipient!");
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Something went wrong.");
    });
};

// Utility function for sending otp
const sendOtp = async (otp, email) => {
  let body = `
    <h2>Hello!</h2>
    <p>We are super glad to have you with us at CoinCoach.</p>
    <p>To continue your registration, you have to fill in your one time password. Please do not disclose this to anyone.</p>
    <p>This is it below:</p>
    <h3><strong>${otp}</strong></h3>
    <br />
    <p>The CoinCoach team.</p>
    <br />
    <p>Kindly ignore if you did not request for this.</p>`;

  const mailConfig = {
    from: process.env.USER_E,
    to: email,
    subject: "One Time Password",
    html: body,
  };

  try {
    transporter.sendMail(mailConfig);
    console.log('OTP sent successfully')
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP. Please try again.');
  }
};

module.exports = { receiveMail, sendOtp };
