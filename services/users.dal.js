const psql = require("./pg_pool");
const bcrypt = require("bcrypt");

// Returns all users, or a blank array if the request fails
// This only returns public data such as user/display name and points
const getUsers = async () => {
  const query =
    "SELECT user_id, username, display_name, points FROM public.users ORDER BY points DESC";

  try {
    const result = await psql.query(query);

    if (DEBUG) console.log(`found ${result.rows.length} users`);

    return result.rows;
  } catch (e) {
    if (DEBUG) console.error(e);
    return [];
  }
};

// Returns the new user row in the database, or a blank array if the request fails
const addUser = async (username, password, email) => {
  const query =
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)";

  try {
    // Use bcrypt to generate a salted password hash
    const hash = await bcrypt.hash(password, 10);

    const result = await psql.query(query, [username, hash, email]);

    if (DEBUG) console.log("new user: " + username);

    return result;
  } catch (e) {
    if (DEBUG) console.error(e);
    return [];
  }
};

module.exports = { getUsers, addUser };
