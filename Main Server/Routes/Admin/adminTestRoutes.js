const express = require("express");
const {
    addTest,
  getAllTests,
  updateTest,
  deleteTest,
} = require("../../Controller/Admin/adminTestController");

const router = express.Router();

router.post("/create", addTest);      
router.get("/readall", getAllTests);     
router.put("/update", updateTest);        
router.delete("/delete", deleteTest);    


module.exports = router;
