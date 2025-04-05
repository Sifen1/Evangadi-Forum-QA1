require("dotenv").config();
const mysql2 = require("mysql2");

const dbConnection = mysql2
  .createPool({
    user: process.env.MYSQL_ADDON_USER,
    database: process.env.MYSQL_ADDON_DB,
    host: process.env.MYSQL_ADDON_HOST,
    password: process.env.MYSQL_ADDON_PASSWORD,
    connectionLimit: 10,
    port: process.env.MYSQL_ADDON_PORT,
    waitForConnections: true,
    enableKeepAlive: true,
  })
  .promise();

// Add connection test
dbConnection
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

module.exports = dbConnection;
