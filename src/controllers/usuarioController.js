const express = require('express')
const authMiddleware = require('../middleware/auth')

const UsuarioRepository = require('../repositories/usuarios.model')
const JwtGenerateToken = require('../components/jwtGeneratorToken')

const router = express.Router()

router.get('/sincronizar', authMiddleware, async (req, res) => {

    const usuarios = await UsuarioRepository.find()
    return res.status(200).send(usuarios)
})

router.post('/cadastrar', async (req, res) => {

    const { email } = req.body

    try {

        if ( await UsuarioRepository.findOne({ email })) {

            return res.status(400).send({
                error: {
                    resume: 'E-mail duplicado',
                    detail: `E-mail [${email}] já foi cadastrado, utilize outro`
                }
            })
        }

        const usuario = await UsuarioRepository.create(req.body)
        usuario.senha = undefined

        return res.send({ 
            usuario, 
            token: JwtGenerateToken({ id: usuario.id }) 
        })

    } catch (error) {

        return res.status(400).send({
            error: {
                resume: 'Erro no registro',
                detail: 'Informe todos os dados obrigatório antes de salvar um usuário'
            }
        })
    }
})

module.exports = app => app.use('/clientes', router)