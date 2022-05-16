/*
 * Copyright (c) 18/04/2022 08:51
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */

const nodeMailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const mailT = nodeMailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
   auth: {
      user: 'hello@bigoodee.com',
      pass: 'WellcomeMailBigoodee'
   }
})

mailT.use('compile', hbs({
   viewEngine: {
      extname: '.hbs',
      layoutsDir: path.resolve('views/'),
      defaultLayout: false
   },
   viewPath: path.resolve('views/'),
   extName: '.hbs'
}))

exports.mailTransporter = mailT
