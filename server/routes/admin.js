const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

router.get("/adminpage", verifyToken, (req, res) => {
  const { isadmin } = req.user;
  if (isadmin === 1) {
    console.log("admin authorized");
    res.json({ message: "Welcome to the admin page!" });
  } else {
    res.status(403).json({ message: "Access denied" });
  }
});

module.exports = router; // Export the router