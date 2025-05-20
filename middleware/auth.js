function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/auth/login");
}

module.exports = {
  isLoggedIn,
};
