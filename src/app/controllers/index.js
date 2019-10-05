const fs = require('fs')
const path = require('path')

module.exports = app => {
    fs
    .readdirSync(__dirname)
    .filter(arquivo => ((arquivo.indexOf('.')) !== 0 && (arquivo !== 'index.js')))
    .forEach(arquivo => require(path.resolve(__dirname, arquivo))(app))
}