const express = require("express");
const {  loginTeacher, updateTeacher, } = require("../../Controller/Teacher/authorization"); 
const router = express.Router();

  
router.post("/login", loginTeacher);      
router.put("/update", updateTeacher); 
 

module.exports = router;
