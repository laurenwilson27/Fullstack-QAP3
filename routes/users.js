const express = require("express");
const router = express.Router();

const { getUsers, getUserById, addUser } = require("../services/users.dal");

// Generic show all users
router.get("/", async (req, res) => {
  const users = await getUsers();

  // Render the userlist based on the response from the users DAL
  res.render("users", { users });
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
    });
});

module.exports = router;
