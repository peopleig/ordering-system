const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log("Failed DB Connection - ", err.message);
    process.exit(1);
  } else {
    console.log("Database connected");
    connection.release();
  }
});

module.exports = pool;