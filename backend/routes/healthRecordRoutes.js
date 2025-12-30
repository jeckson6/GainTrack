const express = require("express");
const router = express.Router();

const healthRecordController = require(
  "../controllers/healthRecordController"
);

// DEBUG (temporary, remove later)
console.log("HealthRecordController:", healthRecordController);

// CREATE
router.post("/", healthRecordController.createRecord);

// READ
router.get("/", healthRecordController.getRecords);

// UPDATE
router.put("/:recordId", healthRecordController.updateRecord);

// DELETE
router.delete("/:recordId", healthRecordController.deleteRecord);

module.exports = router;
