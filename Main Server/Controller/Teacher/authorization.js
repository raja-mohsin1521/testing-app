const pool = require("../../db_Connection/db");
const { generateToken } = require("../../jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // For password hashing

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    return res.status(400).send("Email and password are required and cannot be empty or only white space.");
  }

  try {
    const result = await pool.query(
      "SELECT * FROM teacher WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const teacher = result.rows[0];

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    const token = generateToken(teacher);
    res.json({ teacher, token });
  } catch (err) {
    console.error("Error logging in teacher:", err);
    res.status(500).send("Error logging in teacher");
  }
};

const updateTeacher = async (req, res) => {
  const { token, full_name, password, date_of_birth, phone, address, hire_date, subject_specialization } = req.body;

  if (!token.trim()) {
    return res.status(400).send("Token is required and cannot be empty or only white space.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const result = await pool.query(
      "UPDATE teacher SET full_name = $1, password = COALESCE($2, password), date_of_birth = $3, phone = $4, address = $5, hire_date = $6, subject_specialization = $7 WHERE email = $8 RETURNING *",
      [full_name, hashedPassword, date_of_birth, phone, address, hire_date, subject_specialization, email]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Teacher not found");
    }

    const updatedTeacher = result.rows[0];
    const newToken = generateToken(updatedTeacher);

    res.json({ teacher: updatedTeacher, token: newToken });
  } catch (err) {
    console.error("Error updating teacher:", err);
    res.status(500).send("Error updating teacher");
  }
};

module.exports = {
  loginTeacher,
  updateTeacher,
};
