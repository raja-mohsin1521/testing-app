const express = require("express");
const {
    addTestCenter,
    getAllTestCenters,
    updateTestCenter,
    deleteTestCenter,
    getUpcomingTestCenters,
} = require("../../Controller/Admin/adminTestCenterController");

const router = express.Router();

router.post("/create", addTestCenter);      
router.get("/readall", getAllTestCenters);     
router.put("/update", updateTestCenter);        
router.delete("/delete", deleteTestCenter);    
router.get("/details", getUpcomingTestCenters); 

module.exports = router;
