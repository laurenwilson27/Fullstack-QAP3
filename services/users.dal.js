const psql = require("./pg_pool");
const bcrypt = require("bcrypt");

// Returns all users, or a blank array if the request fails
const getUsers = async () => {
  const query =
    "SELECT user_id, username, display_name, points FROM public.users ORDER BY points DESC";

  try {
    const result = await psql.query(query);

    if (DEBUG) console.log(`found ${result.rows.length} users`);

    return result.rows;
  } catch (e) {
    if (DEBUG) console.error("error: " + e);
    return [];
  }
};

// Returns the new user row in the database, or a blank array if the request fails
const createUser = async (username, password) => {
  const query = "INSERT INTO users (username, password) VALUES ($1, $2)";

  try {
    // Use bcrypt to generate a salted password hash
    const hash = await bcrypt.hash(password, 10);

    const result = await psql.query(query, [username, hash]);
    return result;
  } catch (e) {
    return [];
  }
};

module.exports = { getUsers, createUser };
