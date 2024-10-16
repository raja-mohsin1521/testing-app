const pool = require("../../db_Connection/db");
const { verifyToken } = require("../../jwt");

const addQuestion = async (req, res) => {
    const { token, questions } = req.body;
    console.log('req.body', req.body);
    
    try {
      const decoded = verifyToken(token);
      const teacher_id = decoded.teacher_id;
      console.log('Teacher ID:', teacher_id);
  
      if (!teacher_id) {
        return res.status(400).send("Teacher ID is required.");
      }
  
      const promises = questions.map(async (question) => {
        const {
          questionText,
          correctAnswer,
          options,
          difficultyLevel,
          subject,
        } = question;
  
        const result = await pool.query(
          "INSERT INTO question (teacher_id, question_text, correct_answer, option_1, option_2, option_3, option_4, difficulty_level, subject) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
          [
            teacher_id,
            questionText,
            correctAnswer,
            options[0],
            options[1],
            options[2],
            options[3],
            difficultyLevel.toLowerCase(),
            subject,
          ]
        );
  
        return result.rows[0];
      });
  
      const savedQuestions = await Promise.all(promises);
      res.status(201).json({ questions: savedQuestions });
    } catch (err) {
      console.error("Error adding questions:", err);
      res.status(500).send("Error adding questions");
    }
  };
  
  
  
const getAllQuestions = async (req, res) => {
  const { token } = req.body;
console.log('req.body aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', req.body)
  try {
    const decoded = verifyToken(token);
    const teacher_id = decoded.teacher_id;

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    const result = await pool.query(
      "SELECT * FROM question WHERE teacher_id = $1",
      [teacher_id]
    );

    if (!result.rows.length) {
      return res.status(404).send("No questions found");
    }

    res.json({ questions: result.rows });
  } catch (err) {
    console.error("Error retrieving questions:", err);
    res.status(500).send("Error retrieving questions");
  }
};

const updateQuestion = async (req, res) => {
  const { token, question_id, question_text, answer, difficulty_level } = req.body;

  try {
    const decoded = verifyToken(token);
    const teacher_id = decoded.teacher_id;

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    const result = await pool.query(
      "UPDATE question SET question_text = $1, answer = $2, difficulty_level = $3 WHERE question_id = $4 AND teacher_id = $5 RETURNING *",
      [question_text, answer, difficulty_level, question_id, teacher_id]
    );

    if (!result.rows.length) {
      return res.status(404).send("Question not found or you're not authorized to update this question");
    }

    res.json({ question: result.rows[0] });
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).send("Error updating question");
  }
};

const deleteQuestion = async (req, res) => {
  const { token, question_id } = req.body;

  try {
    const decoded = verifyToken(token);
    const teacher_id = decoded.teacher_id;

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    const result = await pool.query(
      "DELETE FROM question WHERE question_id = $1 AND teacher_id = $2 RETURNING *",
      [question_id, teacher_id]
    );

    if (!result.rows.length) {
      return res.status(404).send("Question not found or you're not authorized to delete this question");
    }

    res.json({ message: "Question deleted successfully", question: result.rows[0] });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).send("Error deleting question");
  }
};

module.exports = {
  addQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
};
