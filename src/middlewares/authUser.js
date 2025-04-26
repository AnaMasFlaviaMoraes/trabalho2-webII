const authUser = (req, res, next) => {
  if (req.session && req.session.user) {
    console.log("User authenticated!");
    return next();
  } else {
    console.log("User not authenticated, redirecting to login page.");
    return res.redirect('/login');
  }
}

module.exports = authUser;