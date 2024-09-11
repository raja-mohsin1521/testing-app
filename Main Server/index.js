const express = require("express");
const dotenv = require("dotenv");
const studentAuthRoutes = require("./Routes/Student/auth-routes");
const teacherAuthRoutes = require("./Routes/Teacher/auth-routes");
const adminHomeRoute = require("./Routes/Admin/adminHomeRoute");
dotenv.config();

const app = express();

app.use(express.json());
app.use("/student", studentAuthRoutes);
app.use("/teacher", teacherAuthRoutes);
app.use("/admin", adminHomeRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
