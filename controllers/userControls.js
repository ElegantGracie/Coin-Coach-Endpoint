const { sequelize } = require("../config/connections.js")
const { User } = require("../models/user.js")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const saltRounds = bcrypt.genSaltSync(10)
const secret = 'secret'

// const signup = (req, res) => {
//     res.send('Signup here')
// }

const signup = async (req, res) => {
    const user = {
        userEmail: req.body.email, 
        password: bcrypt.hashSync(req.body.password, saltRounds)
    }

    await sequelize.sync(
    User.create(user)
    .then((res) => {
        console.log(res)
        res.status(200).json([{message: 'user created'}])
    }).catch(err => {
        console.log(err)
        res.status(403).json([{message: 'email already exists'}])
    })
    )
}

const signin = async (req, res) => {
    const userEmail = req.body.email
    const password = req.body.password

    User.findOne({
        where: {
            userEmail: userEmail
        }
    })
    .then((rs) => {
        if (rs) {
            const validity = bcrypt.compareSync(password, rs.dataValues.password)
            if (validity == true) {
                const token = jwt.sign(rs.dataValues, secret)
                res.status(200).json([{message: token}])
            } else {
                res.status(200).json([{message: 'invalid password'}])
            }
        }
         else {
            res.status(200).json([{message: 'invalid email'}])
        }
    })
    .catch((err) => {
        console.log(err)
    })
}

module.exports = {signup, signin}