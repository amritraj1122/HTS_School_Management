const express = require("express");

const router = express.Router();

const {
  createEnrollment,

  getEnrollments,

  getEnrollment,

  updateEnrollment,

  deleteEnrollment,
} = require("../controllers/enrollmentController");

router.post("/create", createEnrollment);

router.get("/", getEnrollments);

router.get("/:id", getEnrollment);

router.put("/:id", updateEnrollment);

router.delete("/:id", deleteEnrollment);

module.exports = router;
