const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT || 5432,
  host: process.env.PG_HOST || "localhost",
});

module.exports = pool;
