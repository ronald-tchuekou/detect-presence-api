const db_config = require('../config/database.conf')
const {PersonnelTableName} = require("./personnel.model");

const DBInstance = db_config.getDBInstance()
const tableName = 'Paiements'
exports.paidTauxTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function (exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments("paiement_id")
            table.integer('personnel_id', 10)
               .unsigned()
               .index()
               .references('personnel_id')
               .inTable(PersonnelTableName)
               .onDelete('SET NULL')
            table.float('amount')
            table.date("calc_date")
            table.enum('status', ['Payé', 'Non Payé']).defaultTo('Non Payé')
            table.timestamps(true, true, false)
         })
      }
   });
}

exports.addCycle = async (document) => await DBInstance
   .from(tableName)
   .insert(document)

exports.updateCycle = async (document, paiement_id) => await DBInstance
   .from(tableName)
   .update(document)
   .where({paiement_id})

exports.getAllCycles = async () => await DBInstance
   .select()
   .table(tableName)

exports.getCycleById = async (paiement_id) => await DBInstance
   .where({paiement_id})
   .select()
   .table(tableName)

exports.getCycleByCode = async (paiement_id) => await DBInstance
   .where({paiement_id})
   .select()
   .table(tableName)

exports.deleteCycle = async (paiement_id) => await DBInstance
   .where({paiement_id})
   .delete()
   .table(tableName)
