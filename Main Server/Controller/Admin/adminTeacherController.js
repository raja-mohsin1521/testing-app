const pool = require("../../db_Connection/db"); 
const { generateToken } = require("../../jwt"); 

const createTeacher = async (req, res) => {
  const { name, email, password, dateOfBirth, phone, address, hireDate, specialization } = req.body;

  if (!name || !email || !password || !hireDate || !specialization) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const checkEmailResult = await pool.query("SELECT * FROM Teachers WHERE Email = $1", [email]);

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
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
    res.status(500).json({ error: "Server error" });
  }
};

const readAllTeachers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.TeacherID, t.Name, t.Email, COUNT(q.QuestionID) AS TotalQuestions
       FROM Teachers t
       LEFT JOIN Questions q ON t.TeacherID = q.TeacherID
       GROUP BY t.TeacherID`
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

const updateTeacher = async (req, res) => {
  const { teacherId, name, email, password, dateOfBirth, phone, address, hireDate, specialization } = req.body;

  if (!teacherId || !name || !email || !hireDate || !specialization) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const result = await pool.query(
      "UPDATE Teachers SET Name = $1, Email = $2, Password = $3, DateOfBirth = $4, Phone = $5, Address = $6, HireDate = $7, Specialization = $8 WHERE TeacherID = $9 RETURNING *",
      [name, email, password, dateOfBirth, phone, address, hireDate, specialization, teacherId]
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

const deleteTeacher = async (req, res) => {
  const { teacherId } = req.body;

  if (!teacherId) {
    return res.status(400).json({ error: "TeacherID is required" });
  }

  try {
    const result = await pool.query("DELETE FROM Teachers WHERE TeacherID = $1 RETURNING *", [teacherId]);

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
};
