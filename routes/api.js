const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} = require("../services/users.dal");

// Get all users
router.get("/", async (req, res) => {
  const result = await getUsers();

  res.status(result.status).json(result);
});

// Get specific user
router.get("/:id", async (req, res) => {
  const result = await getUserById(req.params.id);

  res.status(result.status).json(result);
});

// Create new user
router.post("/", async (req, res) => {
  // An error should be sent if there are missing parameters
  if (req.params.username && req.params.password && req.params.email) {
    const result = await addUser(
      req.body.username,
      req.body.password,
      req.body.email
    );

    res.status(result.status).json(result);
  } else
    res.status(400).json({
      status: 400,
      message: "Request must contain username, password, email",
    });
});

// Update user
router.patch("/:id", async (req, res) => {
  const result = await updateUser(req.params.id, req.body);

  res.status(result.status).json(result);
});

// Create or update user
router.put("/:id", async (req, res) => {
  // First, check if the user exists.
  const exists = await getUserById(req.params.id);

  if (exists.status == 200) {
    if (exists.data.length > 0) {
      // If the user exists, this is similar to the PATCH method
      const result = await updateUser(req.params.id, req.body);

      res.status(result.status).json(result);
    } else {
      // If the user doesn't exist, this is similar to the POST method
      // An error should be sent if there are missing parameters
      // Note that in this case, the id passed to the API call is not used, but an id must be specified
      if (req.body.username && req.body.password && req.body.email) {
        const result = await addUser(
          req.body.username,
          req.body.password,
          req.body.email
        );

        res.status(result.status).json(result);
      } else
        res.status(400).json({
          status: 400,
          message: "Request must contain username, password, email",
        });
    }
    // If the initial user lookup contained an error, respond with the same error
  } else res.status(exists.status).json(exists);
});

// Delete user
router.delete("/:id", async (req, res) => {
  const result = await deleteUser(req.params.id);

  res.status(result.status).json(result);
});

// Fallback if we can't determine what is being asked of the API
router.use(async (req, res) => {
  res
    .status(400)
    .json({ status: 400, message: "A valid API request was not given." });
});

module.exports = router;
