// teacherController.js
const pool = require("../../db_Connection/db");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../../jwt"); // Import the token functions

const getAddedQuestionsCount = async (req, res) => {
  
  const { token } = req.body; // Extract token from the request body

  try {
    // Verify the token and extract teacher_id
    const decoded = verifyToken(token);  
    const teacher_id = decoded.teacher_id; 
     // Debug log

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    const result = await pool.query(
      "SELECT COUNT(*) AS added_questions_count FROM question WHERE teacher_id = $1",
      [teacher_id]
    );

    if (!result.rows.length) {
      return res.status(404).send("No questions found for the teacher");
    }

    res.json({ added_questions_count: result.rows[0].added_questions_count });
  } catch (err) {
    console.error("Error getting added questions count:", err);
    res.status(500).send("Error getting added questions count");
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
      "SELECT required_questions FROM teacher WHERE teacher_id = $1",
      [teacher_id]
    );

    if (!result.rows.length) {
      return res.status(404).send("Teacher not found");
    }

    res.json({ required_questions: result.rows[0].required_questions });
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
