const express = require("express");
const router = express.Router();
const { register, login, checkUser } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Route for registration
router.post("/register", register);

// Route for login
router.post("/login", login);

// Route to check if the user is authenticated
router.get("/check", authMiddleware, (req, res) => {
  res.json({
    msg: "User is authenticated",
    user: req.user, // Accessing user info from the authMiddleware
  });
});

module.exports = router;
