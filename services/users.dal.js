const { type } = require("os");
const psql = require("./pg.auth");
const bcrypt = require("bcrypt");

// Returns all users, or an empty array if the request fails
// This only returns public data such as user/display name and points
const getUsers = async () => {
  const query =
    "SELECT id, username, display_name, points FROM public.users ORDER BY points DESC";

  try {
    const result = await psql.query(query);

    if (DEBUG) console.log(`found ${result.rows.length} users`);

    return result.rows;
  } catch (e) {
    if (DEBUG) console.error(e);
    return [];
  }
};

// Returns all information from all users with the given id.
// (Id is a unique field, therefore this should never be more than 1 user)
// If this fails, an empty array is returned.
const getUserById = async (id) => {
  const query = "SELECT * FROM public.users WHERE id = $1";

  try {
    const result = await psql.query(query, [id]);

    if (DEBUG) console.log(`found ${result.rows.length} users with id ${id}`);

    return result.rows;
  } catch (e) {
    if (DEBUG) console.error(e);
    return [];
  }
};

// Function which returns all information about a user, but only if the password matches.
// This is somewhat more robust than the other functions - the returned value is an object.
// The object contains a 'status' parameter depending on the result of the lookup.
// For error statuses, a message is included. For a successful lookup, the object contains a
// data field with the full row from the database
const getUserAuth = async (username, password) => {
  const query = "SELECT * FROM public.users WHERE username = $1";

  try {
    const result = await psql.query(query, [username]);

    // Return an error if the user wasn't found
    if (result.rows.length <= 0) {
      return { status: 404, message: `No user '${username}' was found` };
    } else {
      // Comare a hash of the submitted password to the password hash in the database
      if (bcrypt.compareSync(password, result.rows[0].password)) {
        return { status: 200, data: result.rows[0] };
      } else
        return {
          status: 403,
          message: "Password does not match. Check your credentials.",
        };
    }
  } catch (e) {
    if (DEBUG) console.error(e);

    return { status: 503, message: "Database query failed unexpectedly: " + e };
  }
};

// Returns the new user row in the database. Throws an error if this fails.
const addUser = async (username, password, email) => {
  const query =
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)";

  try {
    // Use bcrypt to generate a salted password hash
    const hash = await bcrypt.hash(password, 10);

    // The salted hash is used in the parameterized query
    // Only the hash needs to be stored in the database
    const result = await psql.query(query, [username, hash, email]);

    if (DEBUG) console.log("new user: " + username);

    return result;
  } catch (e) {
    // async functions are contained inside an implicit 'try' block
    // errors can be thrown, and caught like a promise rejection
    throw new Error(e);
  }
};

// Updates a user. Their username must be specified, as well as a data object containing key-value pairs.
// The key-value pairs must match columns in the users table
const updateUser = async (id, data) => {
  let query = "UPDATE users SET ";

  try {
    if (data.length < 1) throw new error("No data to UPDATE was specified.");

    // If there is a password in the updated data, hash it
    if (data.password) data.password = await bcrypt.hash(data.password, 10);

    // Iterate over the key-value pairs
    let keys = [];
    let values = [];

    // Inner function for this next part
    const addKey = (key, isInt = false) => {
      // The user id will be $1, so we start at $2
      keys.push(`${key}=$${keys.length + 2}`);
      if (isInt) values.push(parseInt(data[key]));
      else values.push(data[key]);
    };

    // See if the update data contains values that are allowed to be updated
    // If so, add those values to the query
    if (data.display_name && data.display_name !== "") addKey("display_name");
    if (data.password && data.password !== "") addKey("password");
    if (data.email && data.email !== "") addKey("email");
    if (data.points && data.points !== "") addKey("points", true);

    // Join the collected pairs so that the format is X=Y, A=B, etc.
    // Then, add them to the query
    query += keys.join(", ");
    query += " WHERE id=$1";

    if (DEBUG) {
      console.log("q " + query);
      console.log("v " + [id, ...values]);
      console.log("t " + [id, ...values].map((value) => typeof value));
    }

    const result = await psql.query(query, [id, ...values]);

    return { status: 200 };
  } catch (e) {
    if (DEBUG) console.error(e);

    return { status: 503, message: "Database query failed unexpectedly: " + e };
  }
};

module.exports = { getUsers, getUserById, addUser, getUserAuth, updateUser };
