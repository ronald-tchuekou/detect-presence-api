/*
 * Copyright (c) 06/06/2022 06:58
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */

const socket = require('socket.io')

module.exports = (server) => {
   let io = socket(server, {
      cors: {
         origin: '*',
         method: ['GET', 'POST']
      }
   })

   io.on('connection', (socket) => {
      socket.on('connect', () => {
         console.log('User connected!')
      })

      socket.on('disconnect', () => {
         console.log('User disconnected!')
      })
   })
}
