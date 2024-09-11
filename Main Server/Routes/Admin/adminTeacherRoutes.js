const express = require("express");
const {
  createTeacher,
  readAllTeachers,
  updateTeacher,
  deleteTeacher,
} = require("../../Controller/Admin/adminTeacherController");

const router = express.Router();


router.post("/create", createTeacher);      
router.get("/readall", readAllTeachers);     
router.put("/update", updateTeacher);        
router.delete("/delete", deleteTeacher);    

module.exports = router;
