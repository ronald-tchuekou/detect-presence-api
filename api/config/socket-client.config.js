const io = require('socket.io-client')
module.exports = io(process.env.SOCKET_URI)
