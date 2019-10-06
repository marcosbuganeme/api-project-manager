const fs = require('fs')
const path = require('path')

module.exports = app => {
    fs
    .readdirSync(__dirname)
    .filter(arquivoDoProjeto => ((arquivoDoProjeto.indexOf('.')) !== 0 && (arquivoDoProjeto !== 'index.js')))
    .forEach(arquivoDoProjeto => require(path.resolve(__dirname, arquivoDoProjeto))(app))
}