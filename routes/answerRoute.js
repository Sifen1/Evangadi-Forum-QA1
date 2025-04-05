const express = require("express");
const router = express.Router();
const { getAnswers, createAnswer } = require("../controller/answerController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:question_id", authMiddleware, getAnswers);
router.post("/", authMiddleware, createAnswer);

module.exports = router;
