const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const path = require("path");
require("dotenv").config();

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

// Initialize
const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/blog_app")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Routes
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

// Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
