const express = require("express")
const controller = require("../controllers/cycle.controller");

const router = express.Router()

router.get("/", controller.getAll);
router.get("/id/:id", controller.getById);
router.get("/matricule/:code", controller.getByCode);
router.post("/", controller.create);
router.put("/:matricule", controller.update);
router.delete("/:matricule", controller.delete);

module.exports = router
