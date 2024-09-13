const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import the cors package
const studentAuthRoutes = require("./Routes/Student/auth-routes");
const teacherAuthRoutes = require("./Routes/Teacher/auth-routes");
const adminHomeRoute = require("./Routes/Admin/adminHomeRoute");
const adminTeacherRoutes = require('./Routes/Admin/adminTeacherRoutes');

dotenv.config();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(express.json());
app.use("/student", studentAuthRoutes);
app.use("/teacher", teacherAuthRoutes);
app.use("/admin/home", adminHomeRoute);
app.use("/admin/teacher", adminTeacherRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
