const Pool = require("pg").Pool;
const pool = new Pool({
  user: "qap3-user",
  password: "tABJ8fT9",
  database: "qap3",
});

module.exports = pool;
