const express = require("express");

const router = express.Router();

const {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

router.post("/create", createExam);
router.get("/", getExams);
router.get("/:id", getExam);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

module.exports = router;
