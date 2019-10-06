const mongoose = require('../../config/banco-dados/mongodb-config')

const mongo = mongoose.module

const ProjetoSchema = new mongo.Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    usuario: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    tarefas: [{
        type: mongo.Schema.Types.ObjectId,
        ref: 'Tarefa'
    }],
    dataCriacao: {
        type: Date, 
        required: true,
        default: Date.now
    }
})

const ProjetoRepository = mongo.model('Projeto', ProjetoSchema)

module.exports = ProjetoRepository