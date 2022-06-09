/*
 * Copyright (c) 06/06/2022 06:58
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */

const socket = require('socket.io')
const NotificationsController = require('./api/models/notification.model')

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

      socket.on('serial-detect', (data) => {
         io.emit('serial-detect', data)
      })

      socket.on('notify', async (data) => {
         const ids = await NotificationsController.addCycle(data)
         const response = await NotificationsController.getCycleById(ids[0])
         io.emit('notify', response[0])
      })
   })
}
