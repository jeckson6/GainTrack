const express = require("express");
const router = express.Router();
const {
  getActiveTrainingPlan,
  getTrainingPlanHistory
} = require("../controllers/trainingPlanController");

router.get("/latest", getActiveTrainingPlan);
router.get("/history", getTrainingPlanHistory);

module.exports = router;
