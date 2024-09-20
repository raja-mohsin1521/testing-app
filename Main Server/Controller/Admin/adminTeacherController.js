const pool = require("../../db_Connection/db");
const { generateToken } = require("../../jwt");
const bcrypt = require('bcryptjs');

// Create a new teacher
const createTeacher = async (req, res) => {
  const { name: full_name, email, password, dateofbirth: date_of_birth, phone, address, hiredate: hire_date, specialization: subject_specialization ,questions:required_questions } = req.body;

  try {
    // Check if email already exists
    const checkEmailResult = await pool.query("SELECT * FROM teacher WHERE email = $1", [email]);

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new teacher record
    const result = await pool.query(
      "INSERT INTO teacher (full_name, email, password, date_of_birth, phone, address, hire_date, subject_specialization,required_questions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *",
      [full_name, email, hashedPassword, date_of_birth, phone, address, hire_date, subject_specialization,required_questions]
    );

    const newTeacher = result.rows[0];
    const token = generateToken(newTeacher);

    res.json({ teacher: newTeacher, token });
  } catch (err) {
    console.error("Error creating teacher:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Read all teachers
const readAllTeachers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        t.teacher_id, 
        t.full_name, 
        t.email,
        t.subject_specialization, 
        t.required_questions,
        COUNT(q.question_id) AS total_questions
      FROM teacher t
      LEFT JOIN question q ON t.teacher_id = q.teacher_id
      GROUP BY t.teacher_id`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a specific teacher
const getTeacher = async (req, res) => {
  const { teacher_id } = req.body;

  if (!teacher_id) {
    return res.status(400).json({ error: "TeacherID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT 
        t.teacher_id, 
        t.full_name, 
        t.email, 
        t.date_of_birth, 
        t.phone, 
        t.address, 
        t.hire_date, 
        t.subject_specialization,
        COALESCE(json_agg(
          json_build_object(
            'question_id', q.question_id,
            'question_text', q.question_text
          )
        ) FILTER (WHERE q.question_id IS NOT NULL), '[]') AS questions
      FROM teacher t
      LEFT JOIN questions q ON t.teacher_id = q.teacher_id
      WHERE t.teacher_id = $1
      GROUP BY t.teacher_id`,
      [teacher_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching teacher:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update an existing teacher
const updateTeacher = async (req, res) => {
  const { teacher_id, full_name, email, password, date_of_birth, phone, address, hire_date, subject_specialization } = req.body;

  if (!teacher_id || !full_name || !email || !hire_date || !subject_specialization) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    let hashedPassword = password;

    // If password is provided, hash it
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(
      "UPDATE teacher SET full_name = $1, email = $2, password = $3, date_of_birth = $4, phone = $5, address = $6, hire_date = $7, subject_specialization = $8 WHERE teacher_id = $9 RETURNING *",
      [full_name, email, hashedPassword, date_of_birth, phone, address, hire_date, subject_specialization, teacher_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({ message: "Teacher updated successfully", teacher: result.rows[0] });
  } catch (err) {
    console.error("Error updating teacher:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a teacher
const deleteTeacher = async (req, res) => {
  const { teacher_id } = req.body;

  if (!teacher_id) {
    return res.status(400).json({ error: "TeacherID is required" });
  }

  try {
    const result = await pool.query("DELETE FROM teacher WHERE teacher_id = $1 RETURNING *", [teacher_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({ message: "Teacher deleted successfully", teacher: result.rows[0] });
  } catch (err) {
    console.error("Error deleting teacher:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createTeacher,
  readAllTeachers,
  updateTeacher,
  deleteTeacher,
  getTeacher
};
