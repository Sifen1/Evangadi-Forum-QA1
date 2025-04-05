const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function getAllQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(
      `SELECT q.*, u.username as user_name 
             FROM questions q
             JOIN users u ON q.userid = u.userid 
             ORDER BY q.created_at DESC`
    );

    res.status(StatusCodes.OK).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
}

// Get Single Question
async function getSingleQuestion(req, res) {
  const { question_id } = req.params;

  try {
    const [question] = await dbConnection.query(
      `SELECT q.*, u.username as user_name 
             FROM questions q
             JOIN users u ON q.userid = u.userid 
             WHERE q.questionid = ?`,
      [question_id]
    );

    if (!question.length) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      question: question[0],
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch question",
    });
  }
}

async function createQuestion(req, res) {
  const { title, description } = req.body;
  const { userid } = req.user;

  if (!title?.trim() || !description?.trim()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Title and description are required",
    });
  }

  try {
    const [result] = await dbConnection.query(
      "INSERT INTO questions (title, description, userid) VALUES (?, ?, ?)",
      [title.trim(), description.trim(), userid]
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Question created successfully",
      questionId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create question",
    });
  }
}

async function getUserQuestions(req, res) {
  const { userid } = req.params;

  try {
    const [questions] = await dbConnection.query(
      `
            SELECT 
                questions.*,
                users.username,
                DATE_FORMAT(questions.created_at, '%Y-%m-%d %H:%i:%s') as formatted_date
            FROM questions 
            JOIN users ON questions.userid = users.userid 
            WHERE questions.userid = ?
            ORDER BY created_at DESC
        `,
      [userid]
    );

    res.status(StatusCodes.OK).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Error fetching user questions:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch user questions",
    });
  }
}

module.exports = {
  getAllQuestions,
  getSingleQuestion,
  createQuestion,
  getUserQuestions,
};
