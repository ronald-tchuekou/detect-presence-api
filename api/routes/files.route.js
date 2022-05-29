/*
 * Copyright (c) 15/03/2022 06:57
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */

const upload = require('../utils/upload')
const controller = require('../controllers/file.controller')
const {authJwt} = require('../middlewares')

module.exports = function (app) {
   app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
      next()
   })

   app.post(
      '/files/avatar',
      [authJwt.verifyToken, upload.avatarUpload.single('file')],
      controller.createFile,
      (err, req, res) => {
         res.status(400).send({message: err.message})
      }
   )
   app.put(
      '/files/avatar',
      [authJwt.verifyToken, upload.avatarUpload.single('file')],
      controller.updateFile,
      (err, req, res) => {
         res.status(400).send({message: err.message})
      }
   )
   app.post(
      '/files/message',
      [authJwt.verifyToken, upload.messageUpload.single('file')],
      controller.createFile,
      (err, req, res) => {
         res.status(400).send({message: err.message})
      }
   )
   app.put(
      '/files/message',
      [authJwt.verifyToken, upload.messageUpload.single('file')],
      controller.updateFile,
      (err, req, res) => {
         res.status(400).send({message: err.message})
      }
   )
   app.delete('/files', [authJwt.verifyToken], controller.deleteFile)
   app.get('/files', controller.getFile)
   app.get('/assets/:filename', controller.getAssetsFiels)
}
