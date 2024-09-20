const express = require("express");
const {
  getAllTests,
  getAllCities,
  getAllCenters,
  getSpecificCenters,
  addScheduledTest,
  getScheduleTestDetails,
  getDetailedTestInfo
} = require("../../Controller/Admin/adminScheduleTestController");

const router = express.Router();

router.get("/allcities", getAllCities);
router.get("/alltest", getAllTests);
router.post("/allcenters", getAllCenters);
router.get("/allScheduleTests", getScheduleTestDetails);
router.post("/alldetailedTestInfo", getDetailedTestInfo);
router.post("/specific-centers", getSpecificCenters);
router.post("/schedule-test", addScheduledTest);




module.exports = router;
