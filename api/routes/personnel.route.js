const express = require("express")
const controller = require("../controllers/personnel.controller");

const router = express.Router()

router.get("/", controller.getAll);
router.get("/personnel", controller.getPersonnels)
router.get("/id/:id", controller.getById);
router.get("/matricule/:code", controller.getByCode);
router.post("/", controller.create);
router.post('/card_code_detection', controller.cardCodeDetection)
router.post("/register_card", controller.registerPersonnelCard)
router.post("/register_presence", controller.registerPresence)
router.put("/:id", controller.update);
router.delete("/:matricule", controller.delete);

module.exports = router
