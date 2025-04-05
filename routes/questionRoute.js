const express = require("express");
const router = express.Router();
const {
  getAllQuestions,
  getSingleQuestion,
  createQuestion,
  getUserQuestions,
} = require("../controller/questionController");

// Get all questions
router.get("/", getAllQuestions);

// Get questions by user ID
router.get("/user/:userid", getUserQuestions);

// Get single question
router.get("/:question_id", getSingleQuestion);

// Post new question
router.post("/", createQuestion);

module.exports = router;
