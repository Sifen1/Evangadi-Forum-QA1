const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!email || !password || !firstname || !lastname || !username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User already registered" });
    }

    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid, password, email FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        username: user[0].username,
        userid: user[0].userid,
        email: user[0].email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(StatusCodes.OK).json({
      msg: "User login successful",
      token,
      username: user[0].username,
      email: user[0].email,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

async function checkUser(req, res) {
  const { username, userid } = req.user;

  try {
    const [userData] = await dbConnection.query(
      "SELECT username, email FROM users WHERE userid = ?",
      [userid]
    );

    if (userData.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "User not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      msg: "User is authenticated",
      user: {
        username: userData[0].username,
        userid,
        email: userData[0].email,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching user data",
    });
  }
}

module.exports = { register, login, checkUser };
