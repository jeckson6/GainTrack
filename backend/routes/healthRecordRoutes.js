const express = require("express");
const router = express.Router();
const controller = require("../controllers/healthRecordController");

router.post("/", controller.createRecord);
router.get("/", controller.getRecords);
router.put("/:recordId", controller.updateRecord);
router.delete("/:recordId", controller.deleteRecord);

module.exports = router;
