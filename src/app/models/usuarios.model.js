const bcrypt = require('bcryptjs')

const mongoose = require('../../config/banco-dados/mongodb-config')

const mongo = mongoose.module

const UsuarioSchema = new mongo.Schema({
    email: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true
    },
    senha: { 
        type: String, 
        required: true,
        select: false
    },
    tokenParaResetarSenha: {
        type: String,
        select: false
    },
    dataExpiracaoResetarSenha: {
        type: Date,
        select: false
    },
    dataCriacao: { 
        type: Date, 
        required: true,
        default: Date.now
    },
})

UsuarioSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.senha, 10)
    this.senha = hash

    return next()
})

const UsuarioRepository = mongo.model('usuarios', UsuarioSchema)

module.exports = UsuarioRepository