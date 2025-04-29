const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Valencia.81",
  database: "learning_progress",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
  } else {
    console.log("Connected to the database.");
  }
});

module.exports = connection;
