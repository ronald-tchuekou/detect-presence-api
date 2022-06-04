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

exports.addPaidTaux = async (document) => await DBInstance
   .from(tableName)
   .insert(document)

exports.updatePaidTaux = async (document, paid_taux_id) => await DBInstance
   .where({paid_taux_id})
   .from(tableName)
   .update(document)

exports.getAllCycles = async () => await DBInstance
   .select()
   .table(tableName)

exports.getAllClasses = async () => {
   let classes = await DBInstance
      .table(ClasseTableName)
      .join(tableName, ClasseTableName + '.classe_id', '=', tableName + '.classe_id')
      .select()
   classes = classes.map(item => {
      const taux = DBInstance
         .table(tableName)
         .where({classe_id: item.classe_id})
         .select()
      return {...item, taux: taux.length === 0 ? null : taux[0]}
   })
   return classes
}

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
