const express = require("express");

const PORT = 3000;

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Use the 'static' middleware to map the 'public' directory's static files to a route
app.use("/resources", express.static("public"));

// Index page. By default, all views to be handled by the view engine are inside the 'views' directory
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/users");

// Listen!
app.listen(PORT, () => {
  console.log(
    `Web server listening on port ${PORT} (http://localhost:${PORT})`
  );
});
