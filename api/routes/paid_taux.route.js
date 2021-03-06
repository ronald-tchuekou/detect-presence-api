const express = require("express")
const controller = require("../controllers/paid_taux.controller");

const router = express.Router()

router.get("/", controller.getAll);
router.get("/classe", controller.getAllClass);
router.get("/classe/:id", controller.getByClasse);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router
