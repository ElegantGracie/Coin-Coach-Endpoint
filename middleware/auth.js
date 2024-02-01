const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
// const { now } = require('sequelize/types/utils');

// Authenticating middleware
const verifyAuth = async (req, res, next) => {
    try {
        // Getting the authorization header
        const bearHeader = req.headers["authorization"];

        // Check the type of header
        if (typeof bearHeader == 'undefined') {
            return res.status(403).json([{message: 'No authorization token specified in header'}])
        }

        // Seperate the header and decode the userId
        const bearer = bearHeader.split(' ')
        const b_token = bearer[1]
        let decoded;

        try {
            decoded = jwt.verify(b_token, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err)
            return res.status(401).json({ message: "Invalid or expired token" })
        }

        // Ensure the token contains user's id and expiration date
        if (!decoded.hasOwnProperty("id") || !decoded.hasOwnProperty("exp") || !decoded.id || !decoded.exp) {
            return res.status(403).json({message: "Invalid authentication credentials"});
        }

        const {id, exp} = decoded;

        // Check if token is expired
        if (exp < Math.floor(Date.now() / 1000)) {
            return res.status(403).json({message: "Token has expired. Login again"});
        }

        // Find user
        let user = await User.findOne({where: {userId: id}})

        if (!user) {
            return res.status(403).json({message: "User does not exist"});
        }

        // Authenticate user
        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"})
    }
}

module.exports = {verifyAuth}