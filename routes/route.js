const express = require('express')
const { receiveMail } = require('../utils/sendMessage.js')
const { signout } = require('../controllers/userControls.js')
const { signup, signin, verifyOtp, forgotPassword, resetPassword } = require('../controllers/auth.js')
const { verifyAuth } = require('../middleware/auth.js')

const routemanager = express.Router()

// Authentication routes
routemanager.post('/auth/signup', signup)

routemanager.post('/auth/signin', signin)

routemanager.post('/auth/forgot-password', forgotPassword)

routemanager.post('/auth/signout', signout)

// Authorized Authentication routes
routemanager.post('/auth/verify-otp', verifyAuth, verifyOtp)

routemanager.put('/auth/reset-password', verifyAuth, resetPassword)

// User routes
routemanager.post('/user/contactus', receiveMail)

// Authorized user routes

module.exports = {routemanager}