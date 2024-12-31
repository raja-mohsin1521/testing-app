const express = require("express");
const { 
  loginTeacher, 
  updateTeacher 
} = require("../../Controller/Teacher/authorization");

const { 
  getAddedQuestionsCount, 
  getRequiredQuestionsCount, 
  getTeacherDetails 
} = require('../../Controller/Teacher/dashboard');

const { 
  addObjQuestion,
  addSubjectiveQuestion,
  updateQuestion,
  getObjectiveQuestionsWithoutImages,
  getSubjectiveQuestionsWithoutImages,
  getObjectiveQuestionsWithImages,
  getSubjectiveQuestionsWithImages,
  deleteQuestion,
  importObj,
  importSub,
  getAllCourses,
  getModulesForCourse
} = require('../../Controller/Teacher/questionsController');

const router = express.Router();


router.post("/auth/login", loginTeacher);      
router.put("/auth/update", updateTeacher);  

router.get("/dashboard/added-questions", getAddedQuestionsCount);  
router.get("/dashboard/required-questions", getRequiredQuestionsCount);  
router.get("/dashboard/teacher-details", getTeacherDetails);  

// Questions routes
router.post("/questions/add/objective", addObjQuestion);  
router.post("/questions/add/subjective", addSubjectiveQuestion);  
router.post("/questions/objective/without-images", getObjectiveQuestionsWithoutImages); 
router.post("/questions/subjective/without-images", getSubjectiveQuestionsWithoutImages);
router.post("/questions/objective/with-images", getObjectiveQuestionsWithImages); 
router.post("/questions/subjective/with-images", getSubjectiveQuestionsWithImages);
router.delete("/questions/delete", deleteQuestion);  
router.put("/questions/:id", updateQuestion);

// Import routes
router.post("/questions/import/objective", importObj);
router.post("/questions/import/subjective", importSub);


router.get("/courses", getAllCourses);
router.get("/courses/:courseId/modules", getModulesForCourse);
module.exports = router;
