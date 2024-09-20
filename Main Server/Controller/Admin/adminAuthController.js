
const pool = require("../../db_Connection/db");
const { generateToken } = require("../../jwt");
const bcrypt = require('bcryptjs');






const updateAdminPassword = async (req, res) => {
    const { email, newPassword } = req.body;
  
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }
  console.log('req.body', req.body)
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await pool.query("UPDATE admin SET password = $1 WHERE email = $2 RETURNING *", [hashedPassword, email]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Admin not found" });
      }
  
      res.json({ message: "Password updated successfully", admin: result.rows[0] });
    } catch (err) {
      console.error("Error updating password:", err);
      res.status(500).json({ error: "Server error" });
    }
  };
  

  const verifyAdminLogin = async (req, res) => {
    const { email, password } = req.body;
  console.log('req.body', req.body)
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  
    try {
      const result = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);
  
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      const admin = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, admin.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
     
      const token = generateToken(admin); 
      res.json({ message: "Login successful", token });
    } catch (err) {
      console.error("Error verifying login:", err);
      res.status(500).json({ error: "Server error" });
    }
  };
  
module.exports = {
    updateAdminPassword,
    verifyAdminLogin
  };