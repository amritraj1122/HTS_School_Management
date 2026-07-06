const express = require("express");

const router = express.Router();

const { loadMarks, saveMarks } = require("../controllers/markController");

router.get("/load", loadMarks);

router.post("/save", saveMarks);

module.exports = router;
