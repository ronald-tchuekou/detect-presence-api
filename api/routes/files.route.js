/*
 * Copyright (c) 15/03/2022 06:57
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */

const express = require('express')
const upload = require('../utils/upload')
const controller = require('../controllers/file.controller')
const {authJwt} = require('../middlewares')

const router = express.Router()

router.post(
   '/avatar',
   [authJwt.verifyToken, upload.avatarUpload.single('file')],
   controller.createFile,
   (err, req, res) => {
      res.status(400).send({message: err.message})
   }
)
router.put(
   '/avatar',
   [authJwt.verifyToken, upload.avatarUpload.single('file')],
   controller.updateFile,
   (err, req, res) => {
      res.status(400).send({message: err.message})
   }
)
router.post(
   '/message',
   [authJwt.verifyToken, upload.messageUpload.single('file')],
   controller.createFile,
   (err, req, res) => {
      res.status(400).send({message: err.message})
   }
)
router.put(
   '/message',
   [authJwt.verifyToken, upload.messageUpload.single('file')],
   controller.updateFile,
   (err, req, res) => {
      res.status(400).send({message: err.message})
   }
)
router.delete('/', [authJwt.verifyToken], controller.deleteFile)
router.get('/', controller.getFile)
router.get('/assets/:filename', controller.getAssetsFiels)

module.exports = router
