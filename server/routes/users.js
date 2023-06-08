const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");
<<<<<<< HEAD
const verifyToken = require("../middleware/auth");
=======
const verifyToken = require('../middleware/auth');

>>>>>>> 4bd80dce2f0bef7879f49538336e09dfc7e5af17

// Register a user
router.post("/register", async (req, res) => {
  const {
    id,
    phone_number,
    driving_license,
    picture,
    email,
    password,
    city_code,
    street_name,
    first_name,
    last_name,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user object with hashed password
    const user = {
      id,
      phone_number,
      driving_license,
      picture,
      email,
      password: hashedPassword,
      city_code,
      street_name,
      first_name,
      last_name,
    };

    // Insert the user into the "users" table
    db.query("INSERT INTO users SET ?", user, (error, results) => {
      if (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user" });
      } else {
        res
          .status(200)
          .json({ results: results, message: "User registered successfully" });
      }
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Password is correct, user is authenticated
    // Generate a token
    const token = jwt.sign(
      { userId: user.id, userEmail: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    // Send the token and success message as a response
    res.status(200).json({ message: "Login successful", token });
  });
});

// Protected user page route.
router.get("/homepage", verifyToken, (req, res) => {
  // Access user information from req.user
  const { userId, userEmail } = req.user;

  // Perform actions specific to the authenticated user
  res.json({ message: `Welcome, ${userEmail}! This is your home page.` });
});


<<<<<<< HEAD
router.get("/AddCar", (req,res) {
  const ()
})
=======
router.post('/ContactUs', (req, res) => {
  const { id, message } = req.body;

  // Check if the given id exists in the Users table
  const checkUserQuery = 'SELECT id FROM Users WHERE id = ?';
  connection.query(checkUserQuery, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err, errorMsg: 'Error checking user existence' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ errorMsg: `User with id ${id} does not exist` });
      return;
    }

    // Insert the form data into the UsersContact table
    const sql = `INSERT INTO UsersContact (user_id, message) VALUES (?, ?)`;
    connection.query(sql, [id, message], (err, result) => {
      if (err) {
        res.status(500).json({ error: err, errorMsg: 'Error inserting data into MySQL table' });
        return;
      }

      res.status(200).json({result:result, message: 'Thanks for contacting us! Your message was sent to the admin' });
    });
  });
});


>>>>>>> 4bd80dce2f0bef7879f49538336e09dfc7e5af17

module.exports = router;
