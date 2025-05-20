const express = require("express");
const router = express.Router();
const User = require("../models/user");


router.get("/register", (req, res) => {
  res.render("register");
});


router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/auth/login");
  } catch (err) {
    req.flash("error", "Username already exists");
    res.redirect("/auth/register");
  }
});


router.get("/login", (req, res) => {
  res.render("login");
});


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/auth/login");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/auth/login");
    }

    req.session.user = {
      id: user._id,
      username: user.username,
    };

    req.flash("success", "Successfully logged in");
    res.redirect("/posts");
  } catch (err) {
    req.flash("error", "An error occurred");
    res.redirect("/auth/login");
  }
});


router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
