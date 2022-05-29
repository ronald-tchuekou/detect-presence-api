const PersonnelModel = require('../models/personnel.model')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const config = require('../config/auth.config')
const moment = require("moment");

exports.login = async (req, res) => {
   try {
      const response = await PersonnelModel.getUser({email: req.body.email})
      if (response.length === 0)
         return res.status(400).send({
            message: 'Votre adresse e-mail est incorrect !',
            error: response
         })
      const user = response[0]
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
      if (!passwordIsValid)
         return res.status(400).send({
            message: 'Votre mot de passe est incorrect !',
            error: passwordIsValid
         })
      const pattern = {id: user.personnel_id, role: user.role}
      jwt.sign(pattern, config.secret, {}, async (err, token) => {
            if (err) {
               return res.status(400).json({
                  message: 'Une erreur lors de la connexion via le token!',
                  error: err
               })
            }
            await PersonnelModel.updateCycle({
               created_token: null,
               updated_at: moment().toDate()
            }, user.personnel_id)
            res.json({
               ...user,
               token: token
            })
         }
      )
   } catch (error) {
      res.status(400).json({
         message: 'Une erreur lors de la connexion!',
         error
      })
   }
}

exports.checkUserEmail = async (req, res) => {
   try {
      const response = await PersonnelModel.getUser({email: req.body.email})
      if (response.length === 0)
         return res.status(400).send({
            message: 'Aucun personnel ne possède cette adresse e-mail !',
            error: response
         })
      res.json(response[0])
   } catch (error) {
      res.status(400).json({
         message: 'Une erreur lors de la connexion!',
         error
      })
   }
}

exports.resetPassword = async (req, res) => {
   try {
      const response = await PersonnelModel.updateCycle({
         password: bcrypt.hashSync(req.body.password, 8),
      }, req.body.user_id)
      res.json(response)
   } catch (error) {
      res.status(400).json({
         message: 'Une erreur lors de la connexion!',
         error
      })
   }
}
