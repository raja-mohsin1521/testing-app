const express = require("express");
const { loginTeacher, updateTeacher } = require("../../Controller/Teacher/authorization"); 
const { getAddedQuestionsCount, getRequiredQuestionsCount, getTeacherDetails } = require('../../Controller/Teacher/dashboard');
const { addQuestion, getAllQuestions, updateQuestion, deleteQuestion } = require('../../Controller/Teacher/questionsController');

const router = express.Router();

router.post("/auth/login", loginTeacher);      
router.post("/auth/update", updateTeacher); 
router.post("/dashboard/added-questions", getAddedQuestionsCount);  
router.post("/dashboard/required-questions", getRequiredQuestionsCount);  
router.post("/dashboard/teacher-details", getTeacherDetails);  
router.post("/questions/add", addQuestion);  
router.post("/questions/get", getAllQuestions);  
router.put("/questions/update", updateQuestion);  
router.delete("/questions/delete", deleteQuestion);  

module.exports = router;
