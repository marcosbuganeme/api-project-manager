const jwt = require('jsonwebtoken')

const authConfig = require('../../config/jwt/auth.json')

const JwtGenerateToken = function gerarToken(parametros = {}) {

    return jwt.sign(parametros, authConfig.secret, {
        expiresIn: 86400
    })
}

module.exports = JwtGenerateToken