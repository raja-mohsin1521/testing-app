const express = require("express");
const {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,

} = require("../../Controller/Admin/adminStudentController");

const router = express.Router();

router.post("/", createStudent);              
router.get("/readall",  getAllStudents);     
router.put("/update", updateStudent);        
router.delete("/delete", deleteStudent);    
router.post("/bulk-register", registerStudentsFromExcel);  

module.exports = router;
