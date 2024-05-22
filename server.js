const express = require("express");
const methodOverride = require("method-override");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
global.DEBUG = false;

const app = express();
// Configure middleware
// Use EJS to render views
app.set("view engine", "ejs");
// Support for urlencodedforms
app.use(express.urlencoded({ extended: true }));
// Requests with _method as a paramater will be treated as the specified request method
app.use(methodOverride("_method"));
// Map 'public' directory's static files to a route
app.use("/resources", express.static("public"));

// Registration page
app.get("/register", (req, res) => {
  res.render("register");
});

// Index page. By default, all views to be handled by the view engine are inside the 'views' directory
app.get("/", (req, res) => {
  res.render("index");
});

// Router for all '/users' routes
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// Router for API routes
const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

// Fallback for routes that don't exist
app.use(async (req, res) => {
  res
    .status(404)
    .render("error", { status: 404, message: "resource not found" });
});

// Listen!
app.listen(PORT, () => {
  console.log(
    `Web server listening on port ${PORT} (http://localhost:${PORT})`
  );
});
