const pool = require("../../db_Connection/db");
const { generateToken } = require("../../jwt");
const jwt = require("jsonwebtoken");

const createTeacher = async (req, res) => {
  const { name, email, password, dateOfBirth, phone, address, hireDate, specialization } = req.body;

  if (!name.trim() || !email.trim() || !password.trim() || !dateOfBirth.trim() || !phone.trim() || !address.trim() || !hireDate.trim() || !specialization.trim()) {
    return res.status(400).send("All fields are required and cannot be empty or only white space.");
  }

  try {
    const checkEmailResult = await pool.query(
      "SELECT * FROM Teachers WHERE Email = $1",
      [email]
    );

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).send("Email already exists");
    }

    const result = await pool.query(
      "INSERT INTO Teachers (Name, Email, Password, DateOfBirth, Phone, Address, HireDate, Specialization) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, email, password, dateOfBirth, phone, address, hireDate, specialization]
    );

    const newTeacher = result.rows[0];
    const token = generateToken(newTeacher);

    res.json({ teacher: newTeacher, token });
  } catch (err) {
    console.error("Error creating teacher:", err);
    res.status(500).send("Error creating teacher");
  }
};

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    return res.status(400).send("Email and password are required and cannot be empty or only white space.");
  }

  try {
    const result = await pool.query(
      "SELECT * FROM Teachers WHERE Email = $1 AND Password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const teacher = result.rows[0];
    const token = generateToken(teacher);

    res.json({ teacher, token });
  } catch (err) {
    console.error("Error logging in teacher:", err);
    res.status(500).send("Error logging in teacher");
  }
};

const updateTeacher = async (req, res) => {
  const { token, name, password, dateOfBirth, phone, address, hireDate, specialization } = req.body;

  if (!token.trim()) {
    return res.status(400).send("Token is required and cannot be empty or only white space.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const result = await pool.query(
      "UPDATE Teachers SET Name = $1, Password = $2, DateOfBirth = $3, Phone = $4, Address = $5, HireDate = $6, Specialization = $7 WHERE Email = $8 RETURNING *",
      [name, password, dateOfBirth, phone, address, hireDate, specialization, email]
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

const deleteTeacher = async (req, res) => {
  const { token, password } = req.body;

  if (!token.trim() || !password.trim()) {
    return res.status(400).send("Token and password are required and cannot be empty or only white space.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const checkPasswordResult = await pool.query(
      "SELECT * FROM Teachers WHERE Email = $1 AND Password = $2",
      [email, password]
    );

    if (checkPasswordResult.rows.length === 0) {
      return res.status(401).send("Invalid password");
    }

    const deleteResult = await pool.query(
      "DELETE FROM Teachers WHERE Email = $1 RETURNING *",
      [email]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).send("Teacher not found");
    }

    res.send("Teacher deleted successfully");
  } catch (err) {
    console.error("Error deleting teacher:", err);
    res.status(500).send("Error deleting teacher");
  }
};

module.exports = {
  createTeacher,
  loginTeacher,
  updateTeacher,
  deleteTeacher,
};
