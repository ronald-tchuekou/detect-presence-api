const PaidTauxModel = require('../models/paid_taux.model')
const moment = require("moment");

exports.create = async (req, res) => {
   try {
      const document = req.body
      const response = await PaidTauxModel.addCycle(document)
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
      const response = await PaidTauxModel.updateCycle({
         ...document,
         updated_at: moment().toDate()
      }, req.params.code)
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
      const response = await PaidTauxModel.deleteCycle(req.params.code)
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
      const response = await PaidTauxModel.getAllCycles()
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}

exports.getOne = async (req, res) => {
   try {
      const response = await PaidTauxModel.getCycleById(req.params.id)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}
