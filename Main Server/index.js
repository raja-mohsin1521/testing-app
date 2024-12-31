const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const cors = require("cors");
const multer = require("multer");
const studentAuthRoutes = require("./Routes/Student/auth-routes");
const teacherAuthRoutes = require("./Routes/Teacher/routes");
const adminAuthRoute = require("./Routes/Admin/adminAuthRoutes");
const adminHomeRoute = require("./Routes/Admin/adminHomeRoute");
const adminTeacherRoutes = require('./Routes/Admin/adminTeacherRoutes');
const adminTestCenterRoutes = require('./Routes/Admin/adminTestCenterRoutes');
const adminTestRoutes = require('./Routes/Admin/adminTestRoutes');
const adminScheduleTestRoutes = require('./Routes/Admin/adminScheduleTestRoutes');

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

// **Static middleware at the top**
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/student", studentAuthRoutes);
app.use("/teacher", teacherAuthRoutes);
app.use("/admin/auth", adminAuthRoute);
app.use("/admin/home", adminHomeRoute);
app.use("/admin/schedule-test", adminScheduleTestRoutes);
app.use("/admin/teacher", adminTeacherRoutes);
app.use("/admin/testcenter", adminTestCenterRoutes);
app.use("/admin/test", adminTestRoutes);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
