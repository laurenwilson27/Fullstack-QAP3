const express = require("express");
const router = express.Router();

const { getUsers, addUser } = require("../services/users.dal");

// Generic show all users
router.get("/", async (req, res) => {
  const users = await getUsers();

  // Render the userlist based on the response from the users DAL
  res.render("users", { users });
});

// Show specific user
router.get("/:id", async (req, res) => {});

// Create new user
router.post("/", async (req, res) => {
  // Note that this is very insecure; none of the inputs are validated
  addUser(req.body.username, req.body.password, req.body.email)
    .then(() => {
      res.redirect("/users");
    })
    .catch((e) => {
      console.error("Failed to create new user: " + e);
    });
});

module.exports = router;
