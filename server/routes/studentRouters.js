const express = require("express");

const router = express.Router();

const {
  createStudent,
  getStudents,
  searchStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

router.post("/create", createStudent);

router.get("/", getStudents);

// Search students by Admission No. or Name
router.get("/search", searchStudents);

router.get("/:id", getStudent);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);

module.exports = router;