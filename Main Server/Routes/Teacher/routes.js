const express = require("express");
const { loginTeacher, updateTeacher } = require("../../Controller/Teacher/authorization"); 
const { getAddedQuestionsCount, getRequiredQuestionsCount, getTeacherDetails } = require('../../Controller/Teacher/dashboard');


const router = express.Router();

router.post("/auth/login", loginTeacher);      
router.put("/auth/update", updateTeacher); 
router.post("/dashboard/added-questions", getAddedQuestionsCount);  
router.post("/dashboard/required-questions", getRequiredQuestionsCount);  
router.post("/dashboard/teacher-details", getTeacherDetails);  


module.exports = router;
