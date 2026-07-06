const express = require("express");

const router = express.Router();

const { getClassResult } = require("../controllers/resultController");

const getStudentReport = require("../controllers/results/getStudentReport");

const getClassReport = require("../controllers/results/getClassReport");

// Result List
router.get("/class", getClassResult);

// Single Student Report Card
router.get("/report", getStudentReport);

// Entire Class Report Cards
router.get("/class-report", getClassReport);

module.exports = router;
