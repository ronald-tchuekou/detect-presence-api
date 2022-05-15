const db_config = require('../config/database.conf')

const DBInstance = db_config.getDBInstance()
const tableName = 'Cycles'
exports.CycleTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments("cycle_id")
            table.string('code', 255).unique().index()
            table.string('label', 255).unique()
            table.timestamps(true, true, false)
         })
      }
   });
}

exports.addCycle = async (document) => await DBInstance
   .from(tableName)
   .insert(document)

exports.updateCycle = async (document, id) => await DBInstance
   .where({cycle_id: id})
   .from(tableName)
   .update(document)

exports.getAllCycles = async () => await DBInstance
   .select()
   .table(tableName)

exports.getCycleById = async (id) => await DBInstance
   .where({cycle_id: id})
   .select()
   .table(tableName)

exports.getCycleByCode = async (code) => await DBInstance
   .where({code: code})
   .select()
   .table(tableName)

exports.deleteCycle = async (code) => await DBInstance
   .where({code})
   .delete()
   .table(tableName)
