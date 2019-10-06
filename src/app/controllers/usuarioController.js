const express = require('express')
const crypto = require('crypto')

const UsuarioRepository = require('../models/usuarios.model')
const authMiddleware = require('../middleware/auth.middleware')
const mailer = require('../../config/enviar-email/mailer')
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

router.post('/esqueci-minha-senha', async (req, res) => {
    const { email } = req.body

    try {
        
        const usuario = await UsuarioRepository.findOne({ email })

        if (!usuario) {

            return res.status(400).send({
                error: {
                    resume: 'Usuário não encontrado',
                    detail: 'Lamentamos o incoveniente, porém não encontramos os dados do usuário informado :('
                }
            })
        }

        const token = crypto.randomBytes(20).toString('hex')
        const dataAtual = new Date()
        dataAtual.setHours(dataAtual.getHours() + 1)

        await UsuarioRepository.findByIdAndUpdate(usuario.id, {
            '$set': {
                tokenParaResetarSenha: token,
                dataExpiracaoResetarSenha: dataAtual
            }
        })

        mailer.sendMail({
            to: email,
            from: 'marcos.after@gmail.com',
            template: 'esqueci_minha_senha',
            context: { token },
        }, (error) => {
            if (error) {
                return res.status(400).send({
                    error: {
                        resume: 'Falha ao enviar senha por e-mail',
                        stackError: `stack error: ${error}`,
                        detail: 'Não foi possível enviar a sua nova senha por e-mail, por favor tente novamente mais tarde'
                    }
                })
            }

            return res.send('Foi enviado um e-mail contendo todas as intruções para o reset de senha')
        })

    } catch (error) {

        return res.status(400).send({
            error: {
                resume: 'Erro ao recuperar senha',
                stackError: `stack error: ${error}`,
                detail: 'Servidor não conseguiu processar as informações para recuperação de senha, tente novamente mais tarde :)'
            }
        })
    }
})

module.exports = app => app.use('/usuarios', router)