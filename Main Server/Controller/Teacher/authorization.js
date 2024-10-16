const pool = require("../../db_Connection/db");
const { generateToken } = require("../../jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  console.log('req.body', req.body);

  if (!email.trim() || !password.trim()) {
    return res.status(400).send("Email and password are required and cannot be empty or only white space.");
  }

  try {
    const result = await pool.query(
      "SELECT * FROM teacher WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid email");
    }

    const teacher = result.rows[0];
    console.log("Teacher found:", teacher);

    // Use bcrypt.compare to compare entered password and stored hashed password
    const isMatch = await bcrypt.compare(password, teacher.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).send("Invalid password");
    }

    // Generate token with the teacher's id and other necessary info
    const token = generateToken({ teacher_id: teacher.teacher_id, email: teacher.email });
    console.log('token', token);

    res.json({ teacher, token });
  } catch (err) {
    console.error("Error logging in teacher:", err);
    res.status(500).send("Error logging in teacher");
  }
};

const updateTeacher = async (req, res) => {
  const {  teacher_id, full_name, password, date_of_birth, phone, address, hire_date, subject_specialization } = req.body;
console.log('req.body', req.body)
 
  try {
    


    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    
    const teacherResult = await pool.query("SELECT password FROM teacher WHERE teacher_id = $1", [teacher_id]);
    console.log('',teacherResult )
    let result
    if(teacherResult.rows[0].password===password){
     result = await pool.query(
        "UPDATE teacher SET full_name = $1, date_of_birth = $2, phone = $3, address = $4, hire_date = $5, subject_specialization = $6 WHERE teacher_id = $7 RETURNING *",
        [full_name,  date_of_birth, phone, address, hire_date, subject_specialization, teacher_id]
      );
console.log('password not updated' )
    }
    else{
      result = await pool.query(
        "UPDATE teacher SET full_name = $1, password = COALESCE($2, password), date_of_birth = $3, phone = $4, address = $5, hire_date = $6, subject_specialization = $7 WHERE teacher_id = $8 RETURNING *",
        [full_name, hashedPassword, date_of_birth, phone, address, hire_date, subject_specialization, teacher_id]
      );
      console.log('password updated' )
    }


  

    if (result.rows.length === 0) {
      return res.status(404).send("Teacher not found");
    }

    const updatedTeacher = result.rows[0];

    
    const newToken = generateToken({ teacher_id: updatedTeacher.teacher_id, email: updatedTeacher.email });

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
