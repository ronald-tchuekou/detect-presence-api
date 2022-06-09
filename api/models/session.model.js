const db_config = require('../config/database.conf')
const {PersonnelTableName} = require("./personnel.model");

const DBInstance = db_config.getDBInstance()
const tableName = 'Sessions'
exports.SessionTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments("session_id")
            table.integer('personnel_id', 10)
               .unsigned()
               .index()
               .references('personnel_id')
               .inTable(PersonnelTableName)
               .onDelete('SET NULL')
            table.time('begin')
            table.time('end')
            table.timestamps(true, true, false)
         })
      }
   });
}

exports.addSession = async (document) => await DBInstance
   .from(tableName)
   .insert(document)

exports.updateSession = async (document, period_id) => await DBInstance
   .where({period_id})
   .from(tableName)
   .update(document)

exports.getAllSession = async () => await DBInstance
   .select()
   .table(tableName)

exports.getSessionById = async (session_id) => await DBInstance
   .where({session_id})
   .select()
   .table(tableName)

exports.deleteSession = async (session_id) => await DBInstance
   .where({session_id})
   .delete()
   .table(tableName)
