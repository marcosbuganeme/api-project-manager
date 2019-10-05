const express = require('express')
const bcrypt = require('bcryptjs')

const UsuarioRepository = require('../models/usuarios.model')
const JwtGenerateToken = require('../components/jwtGeneratorToken')

const router = express.Router()

router.post('/usuario', async (req, res) => {

    const { email, senha } = req.body
    const usuario = await UsuarioRepository.findOne({ email }).select('+senha')

    if (!usuario) {
        return res.status(400).send({
            error: {
                resume: 'Usuário não encontrado',
                detail: `E-mail [${email}] cadastrado não existe`
            }
        })
    }

    if (!await bcrypt.compare(senha, usuario.senha)) {
        return res.status(400).send({
            error: {
                resume: 'Senha inválida',
                detail: `Senha informada não bate com o usuário informado`
            }
        })
    }

    usuario.senha = undefined

    return res.send({ 
        usuario, 
        token: JwtGenerateToken({ id: usuario.id }) 
    })
})

module.exports = app => app.use('/autenticar', router)