const express = require('express')
const { receiveMail } = require('../controllers/sendMessage.js')
const { signup, signin } = require('../controllers/userControls.js')
// const { verifyAuth } = require('../middleware/auth.js')

const routemanager = express.Router()

// routemanager.get('/', signup)

routemanager.post('/signup', signup)

routemanager.post('/signin', signin)

routemanager.post('/contactus', receiveMail)

module.exports = {routemanager}