const mysql = require('mysql');
require('dotenv').config();

// defining the sql connection.
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
conn.connect((err) => {
  if (err) {
    console.log('An error occurred while trying to connect to the database');
  } else {
    console.log('Connected to MySQL server...');
  }
});

module.exports = conn;
