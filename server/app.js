require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const createAdmin = require("./utils/createAdmin");
const authRoutes = require("./routes/authRoutes");
const teacherAuthRoutes = require("./routes/teacherAuthRoutes.js");
const teacherRoutes = require("./routes/teacherRoutes.js");
const studentRoutes = require("./routes/studentRouters.js");
const subjectRoutes = require("./routes/subjectRoutes.js");
const classRoutes = require("./routes/classRoutes.js");
const sessionRoutes = require("./routes/sessionRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes.js");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const markRoutes = require("./routes/markRoutes.js");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultRoutes.js");
const path = require("path");


const app = express();

connectDB();
createAdmin();

app.use(
  cors({
    origin: "https://hts-school-frontend.onrender.com",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects/", subjectRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/teacher-auth", teacherAuthRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);


app.use(express.static(path.join(__dirname,"../client")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "HTS School Management API is Running",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
});