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
    administrador: {
        type: Boolean,
        default: false,
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

const UsuarioRepositoryeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkOThlODBmMGI5ZDg5MGIwZjk3Yjc0NCIsImlhdCI6MTU3MDM5MzY2NSwiZXhwIjoxNTcwNDgwMDY1fQ.hsXnK7bkPHP0Bg7yukj2B1pKE8UET4vBHFrQWbPTmxg = mongo.model('Usuario', UsuarioSchema)

module.exports = UsuarioRepository