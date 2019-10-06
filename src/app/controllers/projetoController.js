const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth.middleware')
const mailer = require('../../config/enviar-email/mailer')

const ProjetoRepository = require('../models/projeto.model')
const TarefaRepository = require('../models/tarefa.model')

router.use(authMiddleware)

router.get('/', async (req, res) => {

    try {

        const projetos = await ProjetoRepository.find().populate(['usuario', 'tarefas'])
        return res.send({ projetos })

    } catch (error) {

        return res.status(400).send({
            error: {
                resume: 'Erro pesquisar todos os projetos',
                detail: 'Um erro inesperado ocorreu ao pesquisar por todos os projetos'
            }
        })
    }
})

router.get('/:idProjeto', async (req, res) => {

    try {
        
        const projeto = await ProjetoRepository.findById(req.params.idProjeto).populate(['usuario', 'tarefas'])
        return res.send({ projeto })

    } catch (error) {

        return res.status(400).send({
            error: {
                resume: 'Erro pesquisar projeto pelo seu identificador',
                detail: 'Um erro inesperado ocorreu ao pesquisar por projeto filtrando por seu identificador'
            }
        })
    }
})

router.post('/', async (req, res) => {

    const { titulo, descricao, tarefas } = req.body

    try {

        const projeto = await ProjetoRepository.create({ titulo, descricao, usuario: req.idUsuario })

        await Promise.all(

            tarefas.map(async tarefa => {
                const tarefaDoProjeto = new TarefaRepository({ ...tarefa, projeto: projeto._id })

                await tarefaDoProjeto.save()
                projeto.tarefas.push(tarefaDoProjeto)
            })
        )

        await projeto.save()

        return res.send({projeto: projeto})

    } catch (error) {

        return res.status(400).send({
            error: {
                resume: 'Erro ao criar projeto',
                detail: 'Verifique se todas as propriedades obrigatórias do projeto foram incluidas'
            }
        })
    }
})

router.put('/:idProjeto', async (req, res) => {

    const { titulo, descricao, tarefas } = req.body

    try {

        const projeto = await ProjetoRepository
                                .findOneAndUpdate(req.params.idProjeto, { titulo, descricao }, { new: true })

        projeto.tarefas = []
        await TarefaRepository.remove({ projeto: projeto._id })

        await Promise.all(

            tarefas.map(async tarefa => {
                const tarefaDoProjeto = new TarefaRepository({ ...tarefa, projeto: projeto._id })

                await tarefaDoProjeto.save()
                projeto.tarefas.push(tarefaDoProjeto)
            })
        )

        await projeto.save()

        return res.send({projeto: projeto})

    } catch (error) {

        return res.status(400).send({
            error: {
                resume: 'Erro ao atualizar projeto',
                detail: 'Verifique se todas as propriedades obrigatórias do projeto foram incluidas'
            }
        })
    }
})

router.delete('/:idProjeto', async (req, res) => {

    try {

        await ProjetoRepository.findByIdAndRemove(req.params.idProjeto)
        return  res.send()

    } catch (error) {

        return res.status(400).send({
            error: {
                resume: 'Erro ao remover projeto',
                detail: 'Verifique se o projeto realmente foi selecionado'
            }
        })
    }
})

module.exports = app => app.use('/projetos', router)