const express = require("express")
const controller = require("../controllers/planning.controller");

const router = express.Router()

router.get("/", controller.getAll);
router.get("/in-course", controller.getInCoursePlanning)
router.get('/in-course-all', controller.getAllInCoursePlanning)
router.get('/complet-all', controller.getAllCompletPlanning)
router.get("/classe/:id", controller.getClassePlanning);
router.get("/personnel/in-course/:id", controller.getPersonnelInCourse);
router.get("/presence-state/:personnel_id", controller.getPresenceStateOfPersonnel);
router.get("/personnel/:id", controller.getAllPersonnel);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router
