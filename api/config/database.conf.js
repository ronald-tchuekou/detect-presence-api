const knex = require('knex')

/**
 * @return {Knex<any, unknown[]>}
 */
exports.getDBInstance = () => knex({
   client: 'mysql',
   connection: {
      host: 'eu-cdbr-west-02.cleardb.net',
      port: 3306,
      user: 'b6fd8f95cd3521',
      password: '5c965d14',
      database: "heroku_dc1a5f9ebf1faef"
   }
})
