const express = require("express")
const controller = require("../controllers/auth.contoller");

const router = express.Router()

router.post("/login", controller.login);
router.get('/pass-forgot/:email', controller.checkUserEmail)
router.put('/reset-password', controller.resetPassword)

module.exports = router
