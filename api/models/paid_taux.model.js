const db_config = require('../config/database.conf')
const {ClasseTableName} = require("./classe.model");

const DBInstance = db_config.getDBInstance()
const tableName = 'Paid_taux'
exports.paidTauxTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function (exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments("paid_taux_id")
            table.integer('classe_id', 10)
               .unsigned()
               .index()
               .references('classe_id')
               .inTable(ClasseTableName)
               .onDelete('SET NULL')
            table.float('taux')
            table.enum('status', ['Complète', 'Attente'])
            table.timestamps(true, true, false)
         })
      }
   });
}

exports.addCycle = async (document) => await DBInstance
   .from(tableName)
   .insert(document)

exports.updateCycle = async (document, code) => await DBInstance
   .from(tableName)
   .update(document)
   .where({code})

exports.getAllCycles = async () => await DBInstance
   .select()
   .table(tableName)

exports.getCycleById = async (paid_taux_id) => await DBInstance
   .where({paid_taux_id})
   .select()
   .table(tableName)

exports.getCycleByCode = async (paid_taux_id) => await DBInstance
   .where({paid_taux_id})
   .select()
   .table(tableName)

exports.deleteCycle = async (paid_taux_id) => await DBInstance
   .where({paid_taux_id})
   .delete()
   .table(tableName)
