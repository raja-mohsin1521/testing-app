const express = require("express");
const {
  getAllTests,
  getAllCities,
  getAllCenters,
  getSpecificCenters,
  addScheduledTest,
  getScheduleTestDetails
} = require("../../Controller/Admin/adminScheduleTestController");

const router = express.Router();

router.get("/allcities", getAllCities);
router.get("/alltest", getAllTests);
router.get("/allcenters", getAllCenters);
router.get("/allScheduleTests", getScheduleTestDetails);
router.post("/specific-centers", getSpecificCenters);
router.post("/schedule-test", addScheduledTest);
module.exports = router;
