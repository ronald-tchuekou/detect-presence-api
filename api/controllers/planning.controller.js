const PlanningModel = require('../models/planning.model')
const moment = require("moment");

exports.create = async (req, res) => {
   try {
      const document = req.body
      const response = await PlanningModel.addCycle(document)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}

exports.update = async (req, res) => {
   try {
      const document = req.body
      const response = await PlanningModel.updatePlanning({
         ...document,
         updated_at: moment().toDate()
      }, req.params.id)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}

exports.delete = async (req, res) => {
   try {
      const response = await PlanningModel.deleteCycle(req.params.id)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}

exports.getAll = async (req, res) => {
   try {
      const response = await PlanningModel.getAllCycles()
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}

exports.getAllPersonnel = async (req, res) => {
   try {
      const response = await PlanningModel.getAllPersonnelPlanning(req.params.id)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}

exports.getPersonnelInCourse = async (req, res) => {
   try {
      const response = await PlanningModel.getCurrentDayInCoursePersonnelPlanning(req.params.id)
      res.json(response.length > 0 ? response[0] : {})
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}

exports.getClassePlanning = async (req, res) => {
   try {
      const response = await PlanningModel.getClassePlanning(req.params.id, req.query.start_date, req.query.end_date)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}

exports.getInCoursePlanning = async (req, res) => {
   try {
      const response = await PlanningModel.getCurrentDayInCoursePlanning()
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}

exports.getAllInCoursePlanning = async (req, res) => {
   try {
      const response = await PlanningModel.getCurrentInCoursePlanning()
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}

exports.getAllCompletPlanning = async (req, res) => {
   try {
      const response = await PlanningModel.getCurrentCompletPlanning()
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}

exports.getOne = async (req, res) => {
   try {
      const response = await PlanningModel.getCycleById(req.params.id)
      res.json(response)
   } catch (e) {
      res.status(400).json({
         message: 'Une erreur est survenue !',
         error: e.message
      })
   }
}
