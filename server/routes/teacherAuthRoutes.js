const express = require("express");

const router = express.Router();

const { teacherLogin } = require("../controllers/teacherAuth/teacherLogin");

router.post("/login", teacherLogin);

module.exports = router;
