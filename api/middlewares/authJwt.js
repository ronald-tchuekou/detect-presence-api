const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')
const PersonnelModel = require('../models/personnel.model')

verifyToken = (req, res, next) => {
   let token = req.headers['x-access-token']
   if (!token) {
      return res.status(400).send({
         message: 'Vous devez vous connecter'
      })
   }
   try {
      jwt.verify(token, config.secret, {}, (err, decoded) => {
         if (err) {
            return res.status(401).send({message: 'Vous devez vous connecter!'})
         }
         req.personnel_id = decoded.id
         req.role = decoded.role
         next()
      })
   } catch (error) {
      return res.status(400).json({
         message: 'Une erreur est survenu lors de la vérification du token.',
         error: error
      })
   }
}

isAdmin = async (req, res, next) => {
   const response = await PersonnelModel.getUser({personnel_id: req.personnel_id})
   if (response.length === 0) {
      return res.status(400).json({
         message: 'L\'utilisateur n\'existe pas',
         error: null
      })
   }
   if (response[0].role === 'Admin') {
      next()
      return
   }
   res.status(400).send({
      message: 'Require Admin Role!',
      error: null
   })
}

const authJwt = {
   verifyToken,
   isAdmin
}
module.exports = authJwt
