const db_config = require('../config/database.conf')

const DBInstance = db_config.getDBInstance()
const tableName = 'Personnels'
exports.PersonnelTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments("personnel_id")
            table.string('matricule', 255).unique().index()
            table.string('lastname', 255)
            table.string('firstname', 255)
            table.string('email', 255).unique().index()
            table.string('phone', 255).unique().index()
            table.string('password', 255)
            table.enum('sex', ['F', 'M'])
            table.enum('role', ['Admin', 'Enseignant', 'Agent']).defaultTo("Agent")
            table.text('token')
            table.text('created_token')
            table.text('notification_token')
            table.timestamps(true, true, false)
         })
      }
   });
}

exports.addImageProfileColumn = () => {
   DBInstance.schema.hasColumn(tableName, 'image_profile').then(function (exists) {
      if(!exists){
         return DBInstance.schema.table(tableName, (table) => {
            table
               .string('image_profile', 255)
               .defaultTo("default_image.png")
         })
      }
   })
}

exports.dropImageProfileColumn = () => {
   DBInstance.schema.hasColumn(tableName, 'image_profile').then(function (exists) {
      if(exists){
         return DBInstance.schema.table(tableName, (table) => {
            table.dropColumn('image_profile')
         })
      }
   })
}

/**
 * @param document
 */
exports.getUser = async (document) => await DBInstance
   .from(tableName)
   .where(document)
   .select()

exports.addCycle = async (document) => await DBInstance
   .from(tableName)
   .insert(document)

exports.updateCycle = async (document, personnel_id) => await DBInstance
   .where({personnel_id})
   .from(tableName)
   .update(document)

exports.getAllCycles = async () => await DBInstance
   .where('role', '!=' , 'Admin')
   .select()
   .table(tableName)

exportsgetPersonnels = async() => await DBInstance
   .select()

exports.getCycleById = async (id) => await DBInstance
   .where({personnel_id: id})
   .select()
   .table(tableName)

exports.getCycleByCode = async (matricule) => await DBInstance
   .where({matricule})
   .select()
   .table(tableName)

exports.deleteCycle = async (matricule) => await DBInstance
   .where({matricule})
   .delete()
   .table(tableName)
