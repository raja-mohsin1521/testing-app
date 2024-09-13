const multer = require('multer');
const path = require('path');
const pool = require("../../db_Connection/db");
const { generateToken } = require("../../jwt");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


const createTeacher = async (req, res) => {
  
  const image = req.file ? req.file.filename : null;
  const { name, email, password, dateofbirth, phone, address, hiredate, subject_area } = req.body;
console.log(req.body)
  try {
    const checkEmailResult = await pool.query("SELECT * FROM teachers WHERE email = $1", [email]);

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const result = await pool.query(
      "INSERT INTO teachers (name, email, password, dateofbirth, phone, address, hiredate, subject_area, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [name, email, password, dateofbirth, phone, address, hiredate, subject_area, image]
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
        t.teacherid, 
        t.name, 
        t.email, 
        t.number_of_questions,
        COUNT(q.questionid) AS total_questions
      FROM teachers t
      LEFT JOIN questions q ON t.teacherid = q.teacherid
      GROUP BY t.teacherid`
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
  const { teacherid } = req.body;

  if (!teacherid) {
    return res.status(400).json({ error: "TeacherID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT 
        t.teacherid, 
        t.name, 
        t.email, 
        t.dateofbirth, 
        t.phone, 
        t.address, 
        t.hiredate, 
        t.subject_area, 
        t.image_url,
        COALESCE(json_agg(
          json_build_object(
            'questionid', q.questionid,
            'questiontext', q.questiontext
          )
        ) FILTER (WHERE q.questionid IS NOT NULL), '[]') AS questions
      FROM teachers t
      LEFT JOIN questions q ON t.teacherid = q.teacherid
      WHERE t.teacherid = $1
      GROUP BY t.teacherid`,
      [teacherid]
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
  const { teacherid, name, email, password, dateofbirth, phone, address, hiredate, subject_area } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!teacherid || !name || !email || !hiredate || !subject_area) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const result = await pool.query(
      "UPDATE teachers SET name = $1, email = $2, password = $3, dateofbirth = $4, phone = $5, address = $6, hiredate = $7, subject_area = $8, image_url = $9 WHERE teacherid = $10 RETURNING *",
      [name, email, password, dateofbirth, phone, address, hiredate, subject_area, image, teacherid]
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
  const { teacherid } = req.body;

  if (!teacherid) {
    return res.status(400).json({ error: "TeacherID is required" });
  }

  try {
    const result = await pool.query("DELETE FROM teachers WHERE teacherid = $1 RETURNING *", [teacherid]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({ message: "Teacher deleted successfully" });
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
