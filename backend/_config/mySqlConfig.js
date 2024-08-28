const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");
require("dotenv").config();

const mySqlConfig = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

mySqlConfig.connect((error) => {
  if (error) throw error;
  console.log("MySQL connected.");
});

const mySqlPromiseConfig = mysqlPromise.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

module.exports = {
  mySqlConfig,
  mySqlPromiseConfig,
};