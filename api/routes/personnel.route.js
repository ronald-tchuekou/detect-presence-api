const express = require("express")
const controller = require("../controllers/personnel.controller");

const router = express.Router()

router.get("/", controller.getAll);
router.get("/id/:id", controller.getById);
router.get("/matricule/:code", controller.getByCode);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:matricule", controller.delete);

module.exports = router
