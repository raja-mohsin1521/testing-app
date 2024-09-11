const pool = require("../../db_Connection/db");
const { generateToken } = require("../../jwt");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");

const registerStudentsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const excelFilePath = req.file.path;
    const sheetName = req.body.sheetName;  // Get the sheet name from the request

    const result = excelToJson({
      sourceFile: excelFilePath,
      sheets: [
        {
          name: sheetName, // Use dynamic sheet name from the request
          header: {
            rows: 1,
          },
          columnToKey: {
            A: "name",
            B: "email",
            C: "password",
            D: "dateOfBirth",
            E: "phone",
            F: "address",
          },
        },
      ],
    });

    const students = result[sheetName];
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    for (const student of students) {
      await pool.query(
        "INSERT INTO Students (Name, Email, Password, DateOfBirth, Phone, Address, EnrollmentDate) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          student.name,
          student.email,
          student.password,
          student.dateOfBirth,
          student.phone,
          student.address,
          currentDate, // Use current date for EnrollmentDate
        ]
      );
    }

    fs.unlinkSync(excelFilePath);
    res.json({ message: "Students registered successfully" });
  } catch (err) {
    console.error("Error registering students from Excel:", err);
    res.status(500).send("Error registering students");
  }
};

const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Students");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).send("Error fetching students");
  }
};

const updateStudent = async (req, res) => {
  const { studentID, name, email, password, dateOfBirth, phone, address } = req.body;
  const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

  try {
    const result = await pool.query(
      "UPDATE Students SET Name = $1, Email = $2, Password = $3, DateOfBirth = $4, Phone = $5, Address = $6, EnrollmentDate = $7 WHERE StudentID = $8 RETURNING *",
      [name, email, password, dateOfBirth, phone, address, currentDate, studentID]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Student not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).send("Error updating student");
  }
};

module.exports = {
  registerStudentsFromExcel,
  getAllStudents,
  updateStudent,
};
