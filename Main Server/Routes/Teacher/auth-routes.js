const express = require("express");
const { createTeacher, loginTeacher, updateTeacher, deleteTeacher } = require("../../Controller/Teacher/authorization"); 
const router = express.Router();

router.post("/register", createTeacher);      
router.post("/login", loginTeacher);      
router.put("/update", updateTeacher); 
router.delete("/delete", deleteTeacher); 

module.exports = router;
