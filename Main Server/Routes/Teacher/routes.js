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
  editObjQuestion,
  editSubjQuestion,
  getObjectiveQuestionsWithoutImages,
  getSubjectiveQuestionsWithoutImages,
  getObjectiveQuestionsWithImages,
  getSubjectiveQuestionsWithImages,
  deleteQuestion,
  importObj,
  importSub,
  getAllCourses,
  getModulesForCourse,
  getModuleDetailsByModuleId
} = require('../../Controller/Teacher/questionsController');

const router = express.Router();


router.post("/auth/login", loginTeacher);      
router.put("/auth/update", updateTeacher);  

router.post("/dashboard/added-questions", getAddedQuestionsCount);  
router.post("/dashboard/required-questions", getRequiredQuestionsCount);  
router.post("/dashboard/teacher-details", getTeacherDetails);  


router.post("/questions/add/objective", addObjQuestion);  
router.post("/questions/add/subjective", addSubjectiveQuestion);  
router.post("/questions/objective/without-images", getObjectiveQuestionsWithoutImages); 
router.post("/questions/subjective/without-images", getSubjectiveQuestionsWithoutImages);
router.post("/questions/objective/with-images", getObjectiveQuestionsWithImages); 
router.post("/questions/subjective/with-images", getSubjectiveQuestionsWithImages);
router.delete("/questions/delete", deleteQuestion);  
router.post("/questions/edit/objective", editObjQuestion);  
router.post("/questions/edit/subjective", editSubjQuestion);

router.post("/questions/import/objective", importObj);
router.post("/questions/import/subjective", importSub);


router.get("/courses", getAllCourses);
router.get("/courses/:courseId/modules", getModulesForCourse);
router.get("/courses/modules/:moduleId", getModuleDetailsByModuleId);
module.exports = router;
