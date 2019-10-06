const mongoose = require('../../config/banco-dados/mongodb-config')

const mongo = mongoose.module

const TarefaSchema = new mongo.Schema({
    titulo: {
        type: String,
        required: true
    },
    projeto: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Projeto',
        required: true
    },
    atribuidoPara: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    finalizada: {
        type: Boolean,
        required: true,
        default: false
    },
    dataCriacao: {
        type: Date, 
        required: true,
        default: Date.now
    }
})

const TarefaRepository = mongo.model('Tarefa', TarefaSchema)

module.exports = TarefaRepository