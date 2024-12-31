const pool = require("../../db_Connection/db");
const { generateToken } = require("../../jwt");
const jwt = require("jsonwebtoken");

const createStudent = async (req, res) => {
  const { name, email, password, dateOfBirth, phone, address, enrollmentDate, cnicFrontImage, cnicBackImage } = req.body;

  if (!name.trim() || !email.trim() || !password.trim() || !dateOfBirth.trim() || !phone.trim() || !address.trim() || !enrollmentDate.trim()) {
    return res.status(400).send("All fields are required and cannot be empty or only white space.");
  }

  try {
    // Check if email already exists
    const checkEmailResult = await pool.query(
      "SELECT * FROM Students WHERE Email = $1",
      [email]
    );

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).send("Email already exists");
    }

    // Insert new student and get the result with RETURNING clause
    const result = await pool.query(
      "INSERT INTO Students (Name, Email, Password, DateOfBirth, Phone, Address, EnrollmentDate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, email, password, dateOfBirth, phone, address, enrollmentDate]
    );
    const newStudent = result.rows[0];
      // Log full object to verify field names

    // Ensure studentId is retrieved correctly
    const studentId = newStudent.studentid;
    

    if (!studentId) {
      throw new Error("Student ID is undefined");
    }

    // Determine verification status
    const verificationStatus = cnicFrontImage && cnicBackImage ? 'Pending' : 'Canceled';

    // Insert into StudentVerification
    await pool.query(
      "INSERT INTO StudentVerification (StudentID, CNICFront, CNICBack, VerificationStatus) VALUES ($1, $2, $3, $4)",
      [studentId, cnicFrontImage || null, cnicBackImage || null, verificationStatus]
    );

    // Generate token
    const token = generateToken(newStudent);

    // Send response
    res.json({ student: newStudent, token });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).send("Error creating student");
  }
};


const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    return res.status(400).send("Email and password are required and cannot be empty or only white space.");
  }

  try {
    // Check credentials
    const result = await pool.query(
      "SELECT * FROM Students WHERE Email = $1 AND Password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const student = result.rows[0];
    const token = generateToken(student);

    // Send response
    res.json({ student, token });
  } catch (err) {
    console.error("Error logging in student:", err);
    res.status(500).send("Error logging in student");
  }
};

const updateStudent = async (req, res) => {
  const { token, name, password, dateOfBirth, phone, address, enrollmentDate, cnicFrontImage, cnicBackImage } = req.body;

  if (!token.trim()) {
    return res.status(400).send("Token is required and cannot be empty or only white space.");
  }

  try {
    // Verify token and extract email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Update student details
    const result = await pool.query(
      "UPDATE Students SET Name = $1, Password = $2, DateOfBirth = $3, Phone = $4, Address = $5, EnrollmentDate = $6 WHERE Email = $7 RETURNING *",
      [name, password, dateOfBirth, phone, address, enrollmentDate, email]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Student not found");
    }

    const updatedStudent = result.rows[0];
    const studentId = updatedStudent.studentid;

    if (!studentId) {
      throw new Error("Student ID is undefined");
    }

    // Update or insert into StudentVerification
    if (cnicFrontImage || cnicBackImage) {
      const verificationStatus = cnicFrontImage && cnicBackImage ? 'Pending' : 'Canceled';
      await pool.query(
        "INSERT INTO StudentVerification (StudentID, CNICFront, CNICBack, VerificationStatus) ON CONFLICT (StudentID) DO UPDATE SET CNICFront = EXCLUDED.CNICFront, CNICBack = EXCLUDED.CNICBack, VerificationStatus = EXCLUDED.VerificationStatus",
        [studentId, cnicFrontImage || null, cnicBackImage || null, verificationStatus]
      );
    }

    // Generate new token
    const newToken = generateToken(updatedStudent);

    // Send response
    res.json({ student: updatedStudent, token: newToken });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).send("Error updating student");
  }
};

const deleteStudent = async (req, res) => {
  const { token, password } = req.body;

  if (!token.trim() || !password.trim()) {
    return res.status(400).send("Token and password are required and cannot be empty or only white space.");
  }

  try {
    // Verify token and extract email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Check password and delete student
    const checkPasswordResult = await pool.query(
      "SELECT * FROM Students WHERE Email = $1 AND Password = $2",
      [email, password]
    );

    if (checkPasswordResult.rows.length === 0) {
      return res.status(401).send("Invalid password");
    }

    const deleteResult = await pool.query(
      "DELETE FROM Students WHERE Email = $1 RETURNING *",
      [email]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).send("Student not found");
    }

    // Send response
    res.send("Student deleted successfully");
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).send("Error deleting student");
  }
};

module.exports = {
  createStudent,
  loginStudent,
  updateStudent,
  deleteStudent,
};
