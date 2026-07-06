const express = require("express");

const router = express.Router();

const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController");

router.post("/create", createSession);

router.get("/", getSessions);
router.get("/:id", getSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

module.exports = router;
