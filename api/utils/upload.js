const multer = require('multer')

// Multer config
const storageAvatar = multer.diskStorage({
   destination: function (req, file, cb) {
      const destination = `public/avatars`
      console.log(file.destination)
      cb(null, destination)
   },
   filename: function (req, file, cb) {
      const filename = new Date().getTime() + file.originalname
      cb(null, filename)
   }
})
const storageImage = multer.diskStorage({
   destination: function (req, file, cb) {
      const destination = `public/messages`
      console.log(file.destination)
      cb(null, destination)
   },
   filename: function (req, file, cb) {
      const filename = new Date().getTime() + file.originalname
      cb(null, filename)
   }
})

const fileFilter = (req, file, cb) => {
   console.log('file mime type : ', file.mimetype)
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true)
   } else {
      cb(new Error('Please file we be an image web extension jpg png or jpeg.'))
   }
}

exports.avatarUpload = multer({
   storage: storageAvatar,
   limits: {
      fileSize: 1024 * 1024 // 1m
   },
   fileFilter: fileFilter
})

exports.messageUpload = multer({
   storage: storageImage,
   limits: {
      fileSize: 1024 * 1024 * 10 // 10m
   },
   fileFilter: fileFilter
})
