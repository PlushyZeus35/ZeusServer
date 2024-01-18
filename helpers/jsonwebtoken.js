const JWT = {}
const jwt = require('jsonwebtoken');
const CONFIG = require('../config')

JWT.signToken = (payload) => {
    const jwtOptions = {
        algorithm: CONFIG.JWT.ALGORITHM,
        expiresIn: CONFIG.JWT.EXPIRATION
    }
    return jwt.sign(payload, CONFIG.JWT.SECRET, jwtOptions)
}

JWT.verifyToken = (jwtToken) => {
    const jwtOptions = {
        algorithm: CONFIG.JWT.ALGORITHM
    }
    return jwt.verify(jwtToken, CONFIG.JWT.SECRET, jwtOptions)
}

module.exports = JWT;