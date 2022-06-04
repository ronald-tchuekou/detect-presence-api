const ClasseModel = require('../models/classe.model')
const PaidTauxModel = require('../models/paid_taux.model')
const moment = require("moment");

exports.create = async (req, res) => {
   try {
      const document = req.body
      const response = await ClasseModel.addCycle(document)
      await PaidTauxModel.addPaidTaux({
         classe_id: response,
         taux: '0',
         status: 'Attente'
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
      const response = await ClasseModel.updateCycle({
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
      const response = await ClasseModel.deleteCycle(req.params.code)
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
      const response = await ClasseModel.getAllCycles()
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
      const response = await ClasseModel.getCycleById(req.params.id)
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
      const response = await ClasseModel.getCycleByCode(req.params.code)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e
      })
   }
}
