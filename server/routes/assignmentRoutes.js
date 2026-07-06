const express = require("express");

const router = express.Router();

const { 
    createAssignment,
    getAssignments,
    deleteAssignment
 } = require("../controllers/assignmentController");

router.post("/create", createAssignment);
router.get("/", getAssignments);
router.delete("/:id", deleteAssignment);

module.exports = router;
