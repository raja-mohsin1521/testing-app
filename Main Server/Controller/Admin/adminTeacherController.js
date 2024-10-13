const pool = require("../../db_Connection/db");
const { generateToken } = require("../../jwt");
const bcrypt = require('bcryptjs');

// Create a new teacher



const createTeacher = async (req, res) => {
  const { 
    name: full_name, 
    email, 
    password, 
    dateofbirth: date_of_birth, 
    phone, 
    address, 
    hiredate: hire_date, 
    specialization: subject_specialization, 
    questions: required_questions 
  } = req.body;

  try {
    // Check if email already exists
    const checkEmailResult = await pool.query("SELECT * FROM teacher WHERE email = $1", [email]);

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds

    // Insert new teacher record
    const result = await pool.query(
      "INSERT INTO teacher (full_name, email, password, date_of_birth, phone, address, hire_date, subject_specialization, required_questions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [full_name, email, hashedPassword, date_of_birth, phone, address, hire_date, subject_specialization, required_questions]
    );

    const newTeacher = result.rows[0];

    // Generate a token (you can include only the necessary fields like teacher_id)
    const token = generateToken({ teacher_id: newTeacher.teacher_id });

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
console.log('teacher_id', teacher_id)
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
        t.required_questions, 
        t.subject_specialization,
        COALESCE(json_agg(
          json_build_object(
            'question_id', q.question_id,
            'question_text', q.question_text
          )
        ) FILTER (WHERE q.question_id IS NOT NULL), '[]') AS questions
      FROM teacher t
      LEFT JOIN question q ON t.teacher_id = q.teacher_id
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


const updateTeacher = async (req, res) => {
  const { 
    fullName: full_name, 
    email, 
    password, 
    dateOfBirth: date_of_birth, 
    phone, 
    address, 
    hireDate: hire_date, 
    subjectSpecialization: subject_specialization, 
    requiredQuestions: required_questions 
  } = req.body.teacherData;

  const { teacherId: teacher_id } = req.body;

  console.log('req.body', req.body);

  // Check for required fields
  if (!teacher_id || !full_name || !email || !hire_date || !subject_specialization) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    let updateFields = [
      full_name,
      email,
      date_of_birth,
      phone,
      address,
      hire_date,
      subject_specialization,
      required_questions,
      teacher_id,
    ];

    // Base query without password
    let query = "UPDATE teacher SET full_name = $1, email = $2, date_of_birth = $3, phone = $4, address = $5, hire_date = $6, subject_specialization = $7, required_questions = $8 WHERE teacher_id = $9";

    // If password is provided, hash it and modify the query
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE teacher SET full_name = $1, email = $2, password = $3, date_of_birth = $4, phone = $5, address = $6, hire_date = $7, subject_specialization = $8, required_questions = $9 WHERE teacher_id = $10";
      updateFields.splice(2, 0, hashedPassword); // Insert hashed password at the correct position
    }

    // Execute the query
    const result = await pool.query(query, updateFields);

    // Check if any rows were affected
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Return success response
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
