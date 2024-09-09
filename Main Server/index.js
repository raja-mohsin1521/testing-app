const express = require("express");
const dotenv = require("dotenv");
const studentAuthRoutes = require("./Routes/Student/auth-routes");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/student", studentAuthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
