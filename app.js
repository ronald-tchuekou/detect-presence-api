const express = require('express')
const bodyparser = require('body-parser')
const helmet = require("helmet");
const compression = require('compression')
const cors = require("cors")

const classeRoutes = require('./api/routes/classe.route')
const cycleRoutes = require('./api/routes/cycles.route')
const matiereRoutes = require('./api/routes/matiere.route')
const notificationRoutes = require('./api/routes/notification.route')
const paidTauxRoutes = require('./api/routes/paid_taux.route')
const paiementRoutes = require('./api/routes/paiement.route')
const horaireRoutes = require('./api/routes/horaire.route')
const personnelRoutes = require('./api/routes/personnel.route')
const planningRoutes = require('./api/routes/planning.route')
const authRoutes = require('./api/routes/auth.route')
const fileRoutes = require('./api/routes/files.route')

// Get the application.
const app = express()

// Config express server middlewares.
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(bodyparser.json({limit: '50mb'}))
app.use(bodyparser.urlencoded({
   limit: '50mb',
   parameterLimit: 100000,
   extended: true
}))
app.use((
   req,
   res,
   next
) => {
   res.header('Access-Control-Allow-Origin', '*')
   res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token'
   )
   if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
      return res.status(200).json({})
   }
   next()
})
app.use(express.static(__dirname + '/public'))

// Connection for mysql database.
require('./api/models/classe.model').createTable()
require('./api/models/cycle.model').createTable()
require('./api/models/matiere.model').createTable()
require('./api/models/notification.model').createTable()
require('./api/models/period.model').createTable()
require('./api/models/personnel.model').createTable()
require('./api/models/personnel.model').addImageProfileColumn()
require('./api/models/paid_taux.model').createTable()
require('./api/models/paiement.model').createTable()
require('./api/models/planning.model').createTable()

// Routes
app.get('/', (req, res) => {
   res.send('Welcome to api of Detect-Presence application')
})
app.use('/auth', authRoutes)
app.use('/classe', classeRoutes)
app.use('/cycle', cycleRoutes)
app.use('/matiere', matiereRoutes)
app.use('/notification', notificationRoutes)
app.use('/horaire', horaireRoutes)
app.use('/personnel', personnelRoutes)
app.use('/paid-taux', paidTauxRoutes)
app.use('/paiement', paiementRoutes)
app.use('/planning', planningRoutes)
app.use('/files', fileRoutes)

// Server listening.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
