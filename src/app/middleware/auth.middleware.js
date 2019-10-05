const jwt = require('jsonwebtoken')

const authConfig = require('../../config/jwt/auth.json')

module.exports = (req, res, next) => {

    const autenticacaoHeader = req.headers.authorization
    if (!autenticacaoHeader) {

        return res.status(400).send({
            error: {
                resume: 'Nenhum token foi fornecido',
                detail: 'Nenhum token fornecido nesta requisição'
            }
        })
    }

    const tokenSeparado = autenticacaoHeader.split(' ')
    if (!tokenSeparado.length === 2) {

        return res.status(400).send({
            error: {
                resume: 'Erro de token',
                detail: 'Ocorreu um erro de token, verifique se ele foi inserido corretamente'
            }
        })
    }

    const [ esquema, token ] = tokenSeparado

    if (!/^Bearer$/i.test(esquema)) {
        return res.status(400).send({
            error: {
                resume: 'Token mal formado',
                detail: 'Token enviado está mal formado, revise o token informado'
            }
        })
    }

    jwt.verify(token, authConfig.secret, (error, decoded) => {
        if (error) {
            return res.status(400).send({
                error: {
                    resume: 'Token informado é inválido',
                    detail: 'Token enviado na requisição está inválido, revise o token informado para ver se ele não está expirado'
                }
            })
        }

        req.idUsuario = decoded.id
        return next()
    })
}