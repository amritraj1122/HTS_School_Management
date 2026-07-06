const express = require("express");

const router = express.Router();

const {
    createClass,
    getClasses,
    getClass,
    updateClass,
    deleteClass
} = require("../controllers/classController");

router.post("/create", createClass);
router.get("/", getClasses);
router.get("/:id", getClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

module.exports = router;