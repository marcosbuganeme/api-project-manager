const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const { host, port, user, pass } = require('./mail.json')

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
      user, 
      pass
    }
  });

  const handlebarOptions = {
    viewEngine: {
      extName: '.html',
      partialsDir: path.resolve('./src/config/enviar-email'),
      layoutsDir: path.resolve('./src/config/enviar-email'),
      defaultLayout: 'esqueci_minha_senha.html'
    },
    viewPath: path.resolve('./src/config/enviar-email'),
    extName: '.html'
  }

transport.use('compile', hbs(handlebarOptions))

module.exports = transport