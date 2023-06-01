const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../models/db");

// Register a user
router.post('/users/register', async (req, res) => {
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
    db.query('INSERT INTO users SET ?', user, (error, results) => {
      if (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
      } else {
        res.status(200).json({ results: results, message: 'User registered successfully' });
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Password is correct, user is authenticated
    res.status(200).json({ message: 'Login successful' });
  });
});

module.exports = router;
