const PersonnelModel = require('../models/personnel.model')
const moment = require("moment");
const bcrypt = require("bcrypt")
const {mailTransporter} = require('../config/mails')

exports.create = async (req, res) => {
   try {
      const document = req.body
      const response = await PersonnelModel.addCycle({
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

exports.cardCodeDetection = async (req, res) => {
   try {
      // TODO manage to do right thing.
      let action = '' // Pour la gestion de l'action à effectuer dans l'application.
      if (req.body.status === 'p')
         action = 'Assignation de carte'
      else
         action = 'Indication de présence'
      // Modification du matricule d'un personnel
      await PersonnelModel.updateCycle({matricule: req.body.rfid_code}, 31)
      // Retour des information de modification de données.
      res.json({
         status: 'OK',
         data: req.body,
         action: action
      })
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
      const response = await PersonnelModel.updateCycle({
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
      const response = await PersonnelModel.deleteCycle(req.params.matricule)
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
      const response = await PersonnelModel.getAllCycles()
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
      const response = await PersonnelModel.getCycleById(req.params.id)
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
      const response = await PersonnelModel.getCycleByCode(req.params.code)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}

/**
 * To save card of a personnel.
 */
exports.registerPersonnelCard = () => {
   // TODO
}

/**
 * To set the presence of the personnel.
 */
exports.registerPresence = () => {
   // TODO
}
