const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { isTemporaryEmail } = require('../utils/helpers');
const Subscriber = require('../models/subscribers');
const { sendOtp } = require('../utils/sendMessage');

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

// To register a user
const signup = async (req, res) => {
    try {
        const { userEmail, password, confirmPassword, newsletter, terms } = req.body;

        // Check if user filled the fields
        if (!(userEmail && password && confirmPassword)) return res.status(422).json({ error: 'Please fill all required fields.' });

        // Check email domain
        if (isTemporaryEmail(userEmail)) return res.status(422).json({ error: 'Invalid email' });

        // Check if the user already exists
        const isExisting = await User.findOne({ where: { userEmail } });
        if (isExisting) return res.status(400).json({ message: 'User already exists' });

        // To create a strong password
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!strongPasswordRegex.test(password)) return res.status(400).json({ error: 'Password is not strong' });

        // Confirm password match
        if (password  !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" });

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Ensure user agreed to terms and conditions
        if (!terms) return res.status(403).send({ message: 'You must agree to our Terms & Conditions.' })

        // Generate otp
        const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

        // Create a new user
        const newUser = await User.create({ userEmail, password: hashedPassword, otp });

        // Add user to newsletter list 
        if (newsletter === 'yes') await Subscriber.create({email:  userEmail, userId:  newUser.userId});

        // Generate token
        let token = jwt.sign({ id: newUser.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Email user  with OTP
        await sendOtp(otp, userEmail);

        // Send back the auth token
        return res.status(200).json({ message: "Success", token, email: newUser.userEmail, otp });

    } catch (error) {
        console.error(error);

        if (error.name === 'SequelizeValidationError') {
            // Handle validation errors (e.g., invalid email or password format)
            res.status(400).json({ message: 'Validation error', errors: error.errors });
        } else {
            // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

// To verify email during signup
const verifyOtp = async (req, res) => {
    const id = req.user.userId;

    // Message when no id
    if (!id) return res.status(401).json({message: "User is not authorized"});

    // Check otp
    const {otp} = req.body;

    if (!otp) return res.status(400).json({message: "Provide the sent otp"});

    const userOtp = req.user.otp;

    // Check if otp matches
    if (otp !== userOtp) return res.status(404).json({message: "Invalid otp"});

    try {
        // Generate token
        const token = jwt.sign({id: id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(200).json({message: "Success", token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }

}

// To login a user
const signin = async (req, res) => {
    try{
        const { userEmail, password, signedIn } = req.body;

        // Check if user filled the required fields
        if (!userEmail || !password ) return res.status(400).json({message:"Please fill all the fields"});

        // Check if user exists in database
        const user = await User.findOne({ where : { userEmail } });
        
        if (!user) return res.status(403).json({ message: 'User is not registered' });

        // Validate Password 
        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) return res.status(403).send({message: 'Invalid credentials.'});

        // Create JWT Token and send it to the client side
        let token;

        if(signedIn) {
            token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: '60 days'});
        } else {
            token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: '1 day'});
        }

        return res.status(200).send({message: "Success", token});
    } catch(error){
        console.log('Login Error: ', error);
        return res.status(500).json({message:'Server error'})
    }
}

// To request for password change
const forgotPassword = async (req, res) => {
    const {userEmail} = req.body;

    // Check if user filled the fields
    if (!(userEmail)) return res.status(422).json({ message: 'Please provide email.' });

    // Check if user exists in database
    const user = await User.findOne({ where : { userEmail } });
        
    if (!user) return res.status(403).json({ message: 'User is not registered' });

    // Generate otp
    const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    try {
        // Update user's otp
        await user.update({otp});
        await user.save();

        // Send otp
        await sendOtp(otp, userEmail);

        // Generate token
        let token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({message: "Success", token, otp});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"})
    }

}

// To reset password
const resetPassword = async (req, res) => {
    // Check for authentication
    const id = req.user.userId;

    if(!id) return res.status(401).json({message: "Unauthorized user"});

    // Ensure that fields are filled, password is strong and they match
    const {password, confirmPassword} = req.body;

    if(!password || !confirmPassword) return res.status(400).send({message: "Invalid request"});

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(password)) return res.status(400).json({ error: 'Password is not strong' });

    if(password !== confirmPassword) return res.status(400).json({message: "Passwords do not match"});

    try {
        // Hash and update the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await req.user.update({password: hashedPassword});
        await req.user.save();

        return res.status(200).json({message: "Success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

module.exports = { signup, signin, verifyOtp, forgotPassword, resetPassword };
