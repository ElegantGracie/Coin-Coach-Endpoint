const jwt = require('jsonwebtoken')

const verifyAuth = (req, res, next) => {
    const bearHeader = (req.headers["authorization"])
    if (typeof bearHeader == 'undefined') {
        res.status(403).json([{message: 'token required'}])
    } else {
        const bearer = bearHeader.split(' ')
        const b_token = bearer[1]
        req.token = b_token
        req.decoded = jwt.verify(b_token, 'secret')
        next()
    }
}

module.exports = {verifyAuth}