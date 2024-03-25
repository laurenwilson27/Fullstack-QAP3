const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  addUser,
  getUserAuth,
  updateUser,
} = require("../services/users.dal");

// Generic show all users
router.get("/", async (req, res) => {
  const users = await getUsers();

  // Render the userlist based on the response from the users DAL
  res.render("users", { users });
});

router.get("/login", async (req, res) => {
  // This will be sent as a POST request by a form, but  treated as a GET due to method override
  // All values submitted by the form are stored in req.body
  if (DEBUG) console.log(`Login attempt by '${req.body.username}'`);

  const result = await getUserAuth(req.body.username, req.body.password);

  // Result will include a status code
  switch (result.status) {
    case 200:
      if (DEBUG) console.log("Successful");
      res.render("userEdit", { user: result.data });
      break;
    default:
      if (DEBUG) console.log(`Failed (${result.status}) ${result.message}`);

      res.redirect("/");
  }
});

// Show specific user
router.get("/:id", async (req, res) => {
  const user = await getUserById(req.params.id).then((result) => {
    // If the user wasn't found, the result is []
    if (result.length > 0) res.render("userProfile", { user: result[0] });
    else res.render("error");
  });
});

// Create new user
router.post("/", async (req, res) => {
  // Note that this is very insecure; none of the inputs are validated
  addUser(req.body.username, req.body.password, req.body.email)
    .then(() => {
      res.redirect("/users");
    })
    .catch((e) => {
      console.error(`Failed to create new user ${req.body.username}: ${e}`);
      res.redirect("/users");
    });
});

// Update a specific user. This is, again, very insecure.
router.patch("/", async (req, res) => {
  // Pull the username out of the request
  const id = req.body.id;
  delete req.body.id;

  console.log(req.body);

  // Use the update user DAL function
  updateUser(id, req.body);

  res.redirect("/users/" + id);
});

module.exports = router;
