const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");

const mySqlPromiseConfig = mysqlPromise.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

mySqlPromiseConfig
  .getConnection()
  .then((connection) => {
    console.log("MySQL Promise Pool connected.");
    connection.release();
  })
  .catch((err) => {
    console.error("MySQL Promise Pool connection error:", err);
    process.exit(1);
  });

module.exports = {
  mySqlPromiseConfig,
};
