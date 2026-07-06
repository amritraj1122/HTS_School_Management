const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/teacher/dashboard")
const {
    createTeacher,
    getTeachers,
    updateTeacher,
    deleteTeacher,
    getTeacher,
} = require("../controllers/teacherController");

router.get("/test", (req, res) => {
    res.send("Teacher Route Working");
});

router.post("/create", createTeacher);
router.get("/", getTeachers);
router.get("/dashboard/:teacherId", dashboard);
router.get("/:id", getTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id",deleteTeacher);

module.exports = router;