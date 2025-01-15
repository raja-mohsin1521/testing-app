// teacherController.js
const pool = require("../../db_Connection/db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../../jwt"); // Import the token functions

const getAddedQuestionsCount = async (req, res) => {
  
  const { token } = req.body; // Extract token from the request body
console.log('token', token)
  try {
    // Verify the token and extract teacher_id
    const decoded = verifyToken(token); 
    console.log('token', decoded)
    const teacher_id = decoded.teacher_id; 
     // Debug log
    
    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    // Query to count objective questions
    const objResult = await pool.query(
      "SELECT COUNT(*) AS objective_questions_count FROM obj_question WHERE teacher_id = $1",
      [teacher_id]
    );

    // Query to count subjective questions
    const subResult = await pool.query(
      "SELECT COUNT(*) AS subjective_questions_count FROM subjective_questions WHERE teacher_id = $1",
      [teacher_id]
    );

    const objectiveQuestionsCount = parseInt(objResult.rows[0].objective_questions_count, 10) || 0;
    const subjectiveQuestionsCount = parseInt(subResult.rows[0].subjective_questions_count, 10) || 0;

    res.json({
      objective_questions_count: objectiveQuestionsCount,
      subjective_questions_count: subjectiveQuestionsCount,
    });
  } catch (err) {
    console.error("Error getting questions count:", err);
    res.status(500).send("Error getting questions count");
  }
};

const getRequiredQuestionsCount = async (req, res) => {
  const { token } = req.body; // Extract token from the request body

  try {
    // Verify the token and extract teacher_id
    const decoded = verifyToken(token);  
    const teacher_id = decoded.teacher_id; 

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    const result = await pool.query(
      "SELECT required_objective_questions, required_subjective_questions FROM teacher WHERE teacher_id = $1",
      [teacher_id]
    );

    if (!result.rows.length) {
      return res.status(404).send("Teacher not found");
    }

    const { required_objective_questions, required_subjective_questions } = result.rows[0];

    res.json({ 
      required_objective_questions, 
      required_subjective_questions 
    });
  } catch (err) {
    console.error("Error getting required questions count:", err);
    res.status(500).send("Error getting required questions count");
  }
};


const getTeacherDetails = async (req, res) => {
  const { token } = req.body; // Extract token from the request body

  try {
    // Verify the token and extract teacher_id
    const decoded = verifyToken(token);  
    const teacher_id = decoded.teacher_id; 

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    const result = await pool.query(
      "SELECT * FROM teacher WHERE teacher_id = $1",
      [teacher_id]
    );

    if (!result.rows.length) {
      return res.status(404).send("Teacher not found");
    }

    res.json({ teacher: result.rows[0] });
  } catch (err) {
    console.error("Error getting teacher details:", err);
    res.status(500).send("Error getting teacher details");
  }
};

module.exports = {
  getAddedQuestionsCount,
  getRequiredQuestionsCount,
  getTeacherDetails,
};
