const db_config = require('../config/database.conf')

const DBInstance = db_config.getDBInstance()
const tableName = 'Periods'
exports.PeriodTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments("period_id")
            table.time('begin')
            table.time('end')
            table.enum('type', ['Cours', 'Pause'])
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

exports.getCycleById = async (id) => await DBInstance
   .where({period_id: id})
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
