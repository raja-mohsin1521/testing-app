const express = require("express");
const { createStudent, loginStudent, updateStudent, deleteStudent } = require("../../Controller/Student/authorization"); 
const router = express.Router();

router.post("/register", createStudent);      
router.post("/login", loginStudent);      
router.put("/update", updateStudent); 
router.delete("/delete", deleteStudent); 

module.exports = router;
