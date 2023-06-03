const mysql = require('mysql');
require('dotenv').config();


const conn = mysql.createPool({
  connectionLimit:100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// const mysql = require('mysql');
// const conn = mysql.createConnection({
//   connectionLimit:100,
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// });

// conn.connect((err) => {
//   if(err)
//     console.log(err);
//     else{
//       console.log("Conencted to MYSQL database ");
//     }
    
// })

module.exports = conn;
