const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); 
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // Convert password to a string
  port: process.env.DB_PORT,
});

module.exports = pool;