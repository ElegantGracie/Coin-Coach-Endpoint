const { sequelize } = require("../config/connections.js")
const { User } = require("../models/user.js")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()
const saltRounds = bcrypt.genSaltSync(10)

// signup controller
const signup = async (req, res) => {
    const user = {
        userEmail: req.body.userEmail, 
        password: bcrypt.hashSync(req.body.password, saltRounds)
    }

    await sequelize.sync()
    .then(res => {
        User.create(user)
        .then((res) => {
        console.log(res)
        const token = jwt.sign({ userEmail: user.userEmail }, process.env.SECRET, { expiresIn: '60 days' });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.status(200).json([{message: 'user created'}])
        return res.redirect('/');
        }).catch(err => {
        console.log(err)
        res.status(403).json([{message: 'email already exists'}])
        })
    }).catch(err => {
        res.status(404).json([{message: err}])
    })
    
    
}

// signin controller
const signin = async (req, res) => {
    const userEmail = req.body.userEmail
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
                const token = jwt.sign(rs.dataValues, process.env.SECRET, { expiresIn: '60 days' })
                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                res.status(200).json([{message: token}])
                return res.redirect('/');
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

// signout controller
const signout = async (req, res) => {
    res.clearCookie('nToken');
    return res.redirect('/');
}

module.exports = {signup, signin, signout}