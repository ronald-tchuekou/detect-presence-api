const db_config = require('../config/database.conf')
const {PersonnelTableName} = require("./personnel.model");
const {PeriodTableName} = require("./period.model");
const {ClasseTableName} = require("./classe.model");
const {MatiereTableName} = require("./matiere.model");
const moment = require("moment");

const DBInstance = db_config.getDBInstance()
const tableName = 'Plannings'
exports.planningTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function (exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments("planning_id")
            table.integer('period_id', 10).unsigned().index().references('period_id')
               .inTable(PeriodTableName)
               .onDelete('SET NULL')
            table.integer('classe_id', 10).unsigned().index().references('classe_id')
               .inTable(ClasseTableName)
               .onDelete('SET NULL')
            table.integer('matiere_id', 10).unsigned().index().references('matiere_id')
               .inTable(MatiereTableName)
               .onDelete('SET NULL')
            table.integer('personnel_id', 10).unsigned().index().references('personnel_id')
               .inTable(PersonnelTableName)
               .onDelete('SET NULL')
            table.string('day')
            table.date('date')
            table.timestamps(true, true, false)
         })
      }
   });
}

exports.addNewColumns = () => {
   DBInstance.schema.hasColumn(tableName, 'status').then(function (exists) {
      if (!exists) {
         return DBInstance.schema.table(tableName, (table) => {
            table.enum('status', ['WAITING', 'IN_COURSE', 'COMPLET']).defaultTo("WAITING")
            table.timestamp('start_date')
            table.timestamp('close_date')
         })
      }
      console.log('All the tables is created successfully !')
   })
}

exports.addCycle = async (document) => await DBInstance
   .from(tableName)
   .insert(document)

exports.updatePlanning = async (document, planning_id) => await DBInstance
   .from(tableName)
   .update(document)
   .where({planning_id})

exports.getAllCycles = async () => await DBInstance
   .join(MatiereTableName, tableName + '.matiere_id', MatiereTableName + '.matiere_id')
   .join(PersonnelTableName, tableName + '.personnel_id', PersonnelTableName + '.personnel_id')
   .select()
   .table(tableName)

exports.getCurrentDayInCoursePlanning = async () => await DBInstance
   .join(MatiereTableName, tableName + '.matiere_id', MatiereTableName + '.matiere_id')
   .join(ClasseTableName, tableName + '.classe_id', ClasseTableName + '.classe_id')
   .join(PersonnelTableName, tableName + '.personnel_id', PersonnelTableName + '.personnel_id')
   .join(PeriodTableName, tableName + '.period_id', PeriodTableName + '.period_id')
   .where('date', '=', moment().format('YYYY-MM-DD'))
   .where(tableName + '.status', '=', 'IN_COURSE')
   .select(
      tableName + ".*",
      MatiereTableName + ".label as matiere",
      MatiereTableName + ".code as matiere_code",
      ClasseTableName + ".label as classe",
      ClasseTableName + ".code as classe_code",
      PeriodTableName + ".*",
      PersonnelTableName + '.*'
   )
   .table(tableName)

exports.getCurrentInCoursePlanning = async () => await DBInstance
   .select(
      tableName + ".*",
      MatiereTableName + ".label as matiere",
      MatiereTableName + ".code as matiere_code",
      ClasseTableName + ".label as classe",
      ClasseTableName + ".code as classe_code",
      PeriodTableName + ".*",
      PersonnelTableName + '.*'
   )
   .join(MatiereTableName, tableName + '.matiere_id', MatiereTableName + '.matiere_id')
   .join(ClasseTableName, tableName + '.classe_id', ClasseTableName + '.classe_id')
   .join(PersonnelTableName, tableName + '.personnel_id', PersonnelTableName + '.personnel_id')
   .join(PeriodTableName, tableName + '.period_id', PeriodTableName + '.period_id')
   .where(tableName + '.status', '=', 'IN_COURSE')
   .table(tableName)

exports.getCurrentDayInCoursePersonnelPlanning = async (personnel_id) => await DBInstance
   .select(
      tableName + ".*",
      MatiereTableName + ".label as matiere",
      MatiereTableName + ".code as matiere_code",
      ClasseTableName + ".label as classe",
      ClasseTableName + ".code as classe_code",
      PeriodTableName + ".*",
      PersonnelTableName + '.*'
   )
   .join(MatiereTableName, tableName + '.matiere_id', MatiereTableName + '.matiere_id')
   .join(ClasseTableName, tableName + '.classe_id', ClasseTableName + '.classe_id')
   .join(PersonnelTableName, tableName + '.personnel_id', PersonnelTableName + '.personnel_id')
   .join(PeriodTableName, tableName + '.period_id', PeriodTableName + '.period_id')
   .where('date', '=', moment().format('YYYY-MM-DD'))
   .where(tableName + '.status', '=', 'IN_COURSE')
   .where(tableName + '.personnel_id', '=', personnel_id)
   .table(tableName)

exports.getCurrentCompletPlanning = async () => await DBInstance
   .select(
      tableName + ".*",
      MatiereTableName + ".label as matiere",
      MatiereTableName + ".code as matiere_code",
      ClasseTableName + ".label as classe",
      ClasseTableName + ".code as classe_code",
      PeriodTableName + ".*",
      PersonnelTableName + '.*'
   )
   .join(MatiereTableName, tableName + '.matiere_id', MatiereTableName + '.matiere_id')
   .join(ClasseTableName, tableName + '.classe_id', ClasseTableName + '.classe_id')
   .join(PersonnelTableName, tableName + '.personnel_id', PersonnelTableName + '.personnel_id')
   .join(PeriodTableName, tableName + '.period_id', PeriodTableName + '.period_id')
   .where(tableName + '.status', '=', 'COMPLET')
   .table(tableName)

exports.getCurrentDayPersonnelWaitingPlanning = async (personnel_id) => await DBInstance
   .join(MatiereTableName, tableName + '.matiere_id', MatiereTableName + '.matiere_id')
   .join(ClasseTableName, tableName + '.classe_id', ClasseTableName + '.classe_id')
   .join(PersonnelTableName, tableName + '.personnel_id', PersonnelTableName + '.personnel_id')
   .join(PeriodTableName, tableName + '.period_id', PeriodTableName + '.period_id')
   .where(tableName + '.personnel_id', '=', personnel_id)
   .where('date', '=', moment().format('YYYY-MM-DD'))
   // .where('begin', '>=', moment().add(-1, 'hour').format('HH:mm'))
   // .where('begin', '<=', moment().add(1, 'hour').format('HH:mm'))
   .where(tableName + '.status', '=', 'WAITING')
   .select(
      tableName + ".*",
      MatiereTableName + ".label as matiere",
      MatiereTableName + ".code as matiere_code",
      ClasseTableName + ".label as classe",
      ClasseTableName + ".code as classe_code",
      PeriodTableName + ".*",
      PersonnelTableName + '.*'
   )
   .table(tableName)

exports.getCurrentDayPersonnelInCoursePlanning = async (personnel_id) => await DBInstance
   .join(MatiereTableName, tableName + '.matiere_id', MatiereTableName + '.matiere_id')
   .join(ClasseTableName, tableName + '.classe_id', ClasseTableName + '.classe_id')
   .join(PersonnelTableName, tableName + '.personnel_id', PersonnelTableName + '.personnel_id')
   .join(PeriodTableName, tableName + '.period_id', PeriodTableName + '.period_id')
   .where(tableName + '.personnel_id', '=', personnel_id)
   .where('date', '=', moment().format('YYYY-MM-DD'))
   // .where('end', '<', moment().format('HH:mm'))
   // .where('end', '>=', moment().add(-1, '
   // hour').format('HH:mm'))
   .where(tableName + '.status', '=', 'IN_COURSE')
   .select(
      tableName + ".*",
      MatiereTableName + ".label as matiere",
      MatiereTableName + ".code as matiere_code",
      ClasseTableName + ".label as classe",
      ClasseTableName + ".code as classe_code",
      PeriodTableName + ".*",
      PersonnelTableName + '.*'
   )
   .table(tableName)

exports.getAllPersonnelPlanning = async (personnel_id) => await DBInstance
   .select(
      tableName + ".*",
      MatiereTableName + ".label as matiere",
      MatiereTableName + ".code as matiere_code",
      ClasseTableName + ".label as classe",
      ClasseTableName + ".code as classe_code",
      PeriodTableName + ".*",
      PersonnelTableName + '.*'
   )
   .join(MatiereTableName, tableName + '.matiere_id', MatiereTableName + '.matiere_id')
   .join(ClasseTableName, tableName + '.classe_id', ClasseTableName + '.classe_id')
   .join(PersonnelTableName, tableName + '.personnel_id', PersonnelTableName + '.personnel_id')
   .join(PeriodTableName, tableName + '.period_id', PeriodTableName + '.period_id')
   .where(tableName + '.personnel_id', '=', personnel_id)
   .orderBy('date', 'DESC')
   .table(tableName)

exports.getClassePlanning = async (classe_id, start_date, end_date) => await DBInstance
   .select()
   .join(MatiereTableName, tableName + '.matiere_id', MatiereTableName + '.matiere_id')
   .join(PersonnelTableName, tableName + '.personnel_id', PersonnelTableName + '.personnel_id')
   .where({classe_id})
   .where('date', '>=', start_date)
   .where('date', '<=', end_date)
   .table(tableName)

exports.getCycleById = async (planning_id) => await DBInstance
   .where({planning_id})
   .select()
   .table(tableName)

exports.getCycleByCode = async (planning_id) => await DBInstance
   .where({planning_id})
   .select()
   .table(tableName)

exports.deleteCycle = async (planning_id) => await DBInstance
   .where({planning_id})
   .delete()
   .table(tableName)

exports.getPersonnelPresence = async (personnel_id) => await DBInstance
   .select(
      tableName + ".*",
      MatiereTableName + ".label as matiere",
      MatiereTableName + ".code as matiere_code",
      ClasseTableName + ".label as classe",
      ClasseTableName + ".code as classe_code",
      PeriodTableName + ".*",
   )
   .join(MatiereTableName, tableName + '.matiere_id', MatiereTableName + '.matiere_id')
   .join(ClasseTableName, tableName + '.classe_id', ClasseTableName + '.classe_id')
   .join(PeriodTableName, tableName + '.period_id', PeriodTableName + '.period_id')
   .where(tableName + '.personnel_id', '=', personnel_id)
   .where('date', '<=', moment().format('YYYY-MM-DD'))
   .table(tableName)
