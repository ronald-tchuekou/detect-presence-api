const PersonnelModel = require('../models/personnel.model')
const moment = require("moment");
const bcrypt = require("bcrypt")
const socket = require("../config/socket-client.config")
const {mailTransporter} = require('../config/mails')

exports.create = async (req, res) => {
   try {
      const document = req.body
      const response = await PersonnelModel.addPersonnel({
         ...document,
         password: bcrypt.hashSync('password', 8),
         created_token: bcrypt.hashSync('password', 5),
      })

      console.log(response)

      const mailOptions = {
         from: '"Detect-Presence" <ronaldtchuekou@gmail.com>',
         to: req.body.email,
         cc: req.body.email,
         bcc: req.body.email,
         subject: 'Bienvenue dans l\'application Detect-Presence',
         template: 'account_created',
         context: {
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email,
            password: 'password',
         }
      }

      mailTransporter.sendMail(mailOptions, (err, info) => {
         if (err) {
            console.log('Error when send the mail: ', err)
         } else {
            console.log('The welcome mail is send!', info)
         }
      })

      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}

exports.update = async (req, res) => {
   try {
      const document = req.body
      const response = await PersonnelModel.updatePersonnel({
         ...document,
         updated_at: moment().toDate()
      }, req.params.id)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}

exports.delete = async (req, res) => {
   try {
      const response = await PersonnelModel.deletePersonnel(req.params.matricule)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}

exports.getAll = async (req, res) => {
   try {
      const response = await PersonnelModel.getAllPersonnels()
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}

exports.getPersonnels = async (req, res) => {
   try {
      const response = await PersonnelModel.getPersonnels()
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}

exports.getById = async (req, res) => {
   try {
      const response = await PersonnelModel.getPersonnelById(req.params.id)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}

exports.getByCode = async (req, res) => {
   try {
      const response = await PersonnelModel.getPersonnelByCode(req.params.code)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}

exports.cardCodeDetection = async (req, res) => {
   try {
      // Check the serial data.
      const serial_code = req.query.serial;
      if (!serial_code) {
         return res.status(401).json({
            message: 'Veuillez renseigner la valeur du paramètre *serial* !',
            error: null
         })
      }

      const find_personnel_response = await PersonnelModel.findSerialCode(serial_code)
      if (find_personnel_response.length === 0) { // Any personne find.
         socket.emit('serial-detect', {
            serial_code,
            is_first: true
         })
         res.json({
            status: 'OK',
            action: 'Assignation de code serial',
            serial_code
         })
      } else { // When we find one or more personnel
         socket.emit('serial-detect', {
            serial_code,
            is_first: false,
            personnel: find_personnel_response[0]
         })
         res.json({
            status: 'OK',
            action: 'Indication de présence',
            serial_code,
            personnel: find_personnel_response[0]
         })
      }
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}
