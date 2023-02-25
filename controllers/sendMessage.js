const { User } = require("../models/user.js")
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_E,
        pass: process.env.E_PASS
    }
})

// verify connection configuration
transporter.verify( (error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
});

const receiveMail = (req, res) => {
    const mailer = {
        fullName: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message
    }

    const mailConfig = {
        from: mailer.email,
        to: process.env.USER_E,
        subject: mailer.fullName,
        text: `${mailer.message} \n I receive calls or SMS at ${mailer.phone} `
    }

    transporter.sendMail(mailConfig)
        .then((rs) => {
            res.status(200).send("Email successfully sent to recipient!");
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Something went wrong.");
        })
    
}

module.exports = {receiveMail}
  