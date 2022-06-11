const PersonnelModel = require('../models/personnel.model')
const PlanningModel = require('../models/planning.model')
const moment = require("moment");
const bcrypt = require("bcrypt")
const {mailTransporter} = require('../config/mails')
const notifications = require('../config/notification')
const socket = require("../config/socket-client.config");

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

const newPresenceDetected = async (personnel) => {
   const notify_title = `${personnel.sex === 'F' ? 'Md' : 'Mr'} ${personnel.lastname + ' ' + personnel.firstname}`
   let notification_title
   let  notify_content
   let  notification_content
   let send = false
   let is_start = false
   let planning = {}

   const plannings = await PlanningModel.getCurrentDayPersonnelInCoursePlanning(personnel.personnel_id)
   console.log('Planning : ', plannings)
   if(plannings.length !== 0){
      const current = plannings[0]
      planning = current
      is_start = false
      await PlanningModel.updatePlanning({
         status: 'COMPLET',
         close_date: moment().format('YYYY-MM-DD HH:mm:ss')
      }, current.planning_id)
      notification_title = 'Fermeture d\'une nouvelle session'
      notification_content = `Vous avez fermé la session pour le cours de ${
         current.matiere
      } pour la classe de ${current.classe}`
      notify_content = 'Fermeture d\'une nouvelle session de cours'
      send = true
   }else{
      const plan = await PlanningModel.getCurrentDayPersonnelWaitingPlanning(personnel.personnel_id)
      console.log('Plan : ', plan)
      if(plan.length !== 0){
         const current = plan[0]
         planning = current
         is_start = true
         await PlanningModel.updatePlanning({
            status: 'IN_COURSE',
            start_date: moment().format('YYYY-MM-DD HH:mm:ss')
         }, current.planning_id)
         notification_title = 'Ouverture d\'une nouvelle session'
         notification_content = `Vous avez ouvert la session pour le cours de ${
            current.matiere
         } pour la classe de ${current.classe}`
         notify_content = 'Ouverture d\'une nouvelle session de cours'
         send = true
      }
   }

   if(send){
      await notifications.sendNotificationPush(
         personnel.notify_token ? [personnel.notify_token] : [],
         notification_title,
         notification_content
      )
      socket.emit('notify', {
         title: notify_title,
         content: notify_content
      })
      socket.emit('session-detect', {
         is_start: is_start,
         personnel: personnel,
         planning: planning
      })
   }
}

exports.cardCodeDetection = async (req, res) => {
   const socket = require("../config/socket-client.config")

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
            status: 'R',
            action: 'Assignation de code serial',
            serial_code
         })
      } else { // When we find one or more personnel
         socket.emit('serial-detect', {
            serial_code,
            is_first: false,
            personnel: find_personnel_response[0]
         })
         await newPresenceDetected(find_personnel_response[0])
         res.json({
            status: 'P',
            action: 'Indication de présence',
            serial_code,
            personnel: find_personnel_response[0]
         })
      }
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}
