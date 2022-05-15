const express = require("express")
const controller = require("../controllers/cycle.controller");

const router = express.Router()

router.get("/", controller.getAll);
router.get("/id/:id", controller.getById);
router.get("/code/:code", controller.getByCode);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:code", controller.delete);

module.exports = router
