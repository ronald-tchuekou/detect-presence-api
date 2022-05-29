const db_config = require('../config/database.conf')
const {PersonnelTableName} = require("./personnel.model");
const {PeriodTableName} = require("./period.model");
const {ClasseTableName} = require("./classe.model");
const {MatiereTableName} = require("./matiere.model");

const DBInstance = db_config.getDBInstance()
const tableName = 'Plannings'
exports.planningTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function (exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments("planning_id")
            table.integer('period_id', 10)
               .unsigned()
               .index()
               .references('period_id')
               .inTable(PeriodTableName)
               .onDelete('SET NULL')
            table.integer('classe_id', 10)
               .unsigned()
               .index()
               .references('classe_id')
               .inTable(ClasseTableName)
               .onDelete('SET NULL')
            table.integer('matiere_id', 10)
               .unsigned()
               .index()
               .references('matiere_id')
               .inTable(MatiereTableName)
               .onDelete('SET NULL')
            table.integer('personnel_id', 10)
               .unsigned()
               .index()
               .references('personnel_id')
               .inTable(PersonnelTableName)
               .onDelete('SET NULL')
            table.string('day')
            table.date('date')
            table.timestamps(true, true, false)
         })
      }
      console.log('All the tables is created successfully !')
   });
}

exports.addCycle = async (document) => await DBInstance
   .from(tableName)
   .insert(document)

exports.updateCycle = async (document, planning_id) => await DBInstance
   .from(tableName)
   .update(document)
   .where({planning_id})

exports.getAllCycles = async () => await DBInstance
   .select()
   .table(tableName)

exports.getClassePlanning = async (classe_id) => await DBInstance
   .where({classe_id})
   .join(MatiereTableName, tableName+'.matiere_id', MatiereTableName + '.matiere_id')
   .join(PersonnelTableName, tableName+'.personnel_id', PersonnelTableName + '.personnel_id')
   .select()
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
