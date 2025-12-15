const express = require("express");
const router = express.Router();
const controller = require("../controllers/trainingPlanController");

router.get("/", controller.getPlansByUser);
router.post("/", controller.createPlan);

module.exports = router;
