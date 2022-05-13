const knex = require('knex')

/**
 * @return {Knex<any, unknown[]>}
 */
exports.getDBInstance = () => knex({
   client: 'mysql',
   connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: "detect_presences"
   }
})
