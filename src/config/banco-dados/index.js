const mongoose = require('mongoose')

let conexao = 'mongodb://localhost/jornada-cliente'

mongoose.Promise = global.Promise

mongoose.connect(conexao, {
    useMongoClient: true
})
.then(() => console.log('mongodb está em execução'))
.catch((error) => console.log('Erro inesperado na iniciliazação do mongo: ' + error))

mongoose.set('debug', true)

exports.module = mongoose