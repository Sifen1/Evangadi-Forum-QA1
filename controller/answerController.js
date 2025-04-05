const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function getAnswers(req, res) {
  const { question_id } = req.params;
  try {
    const [answers] = await dbConnection.query(
      `SELECT a.*, u.username as user_name 
             FROM answers a
             JOIN users u ON a.userid = u.userid 
             WHERE a.questionid = ?`,
      [question_id]
    );
    res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching answers",
    });
  }
}

async function createAnswer(req, res) {
  const { questionid, answer } = req.body;
  const { userid } = req.user;

  if (!answer || !questionid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide both question ID and answer",
    });
  }

  try {
    await dbConnection.query(
      "INSERT INTO answers (questionid, userid, answer) VALUES (?, ?, ?)",
      [questionid, userid, answer]
    );

    res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully",
    });
  } catch (error) {
    console.error("Error creating answer:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error posting answer",
    });
  }
}
module.exports = {
  getAnswers,
  createAnswer,
};
