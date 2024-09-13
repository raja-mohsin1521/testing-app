const express = require("express");
const {
  createTeacher,
  readAllTeachers,
  updateTeacher,
  deleteTeacher,
  getTeacher
} = require("../../Controller/Admin/adminTeacherController");

const router = express.Router();


router.post("/create", createTeacher);      
router.get("/readall", readAllTeachers);     
router.put("/update", updateTeacher);        
router.delete("/delete", deleteTeacher);    
router.post("/getteacher", getTeacher); 
module.exports = router;
