const express = require("express");
const router = express.Router();

const { getUsers } = require("../services/users.dal");

// Generic show all users
router.get("/", async (req, res) => {
  const users = await getUsers();

  // Render the userlist based on the response from the users DAL
  res.render("users", { users });
});

// Show specific user
router.get("/:id", async (req, res) => {});

// Create new user
router.post("/", async (req, res) => {});

module.exports = router;
