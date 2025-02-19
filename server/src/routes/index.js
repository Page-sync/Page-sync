const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");

// Public route
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Connected",
  });
});
// Protected route
router.get("/protected", authenticateUser, (req, res) => {
  res.status(200).json({
    message: "This is a protected route",
    user: req.user,
  });
});

module.exports = router;
