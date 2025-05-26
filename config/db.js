const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'bizxyeedunp7xlsiiq2t-mysql.services.clever-cloud.com',
  user: process.env.DB_USER || 'uy0m4umerr56mqtm',
  password: process.env.DB_PASSWORD || 'exTTXlywj04JsU9skwkx',
  database: process.env.DB_NAME || 'bizxyeedunp7xlsiiq2t',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 seconds timeout to avoid ETIMEDOUT quickly
});

// Convert pool to use promises
const promisePool = pool.promise();

module.exports = promisePool;
