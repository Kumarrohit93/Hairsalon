const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/superadmin/loginPage");
  }
  next();
};

const isSuperAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "superadmin") {
    return res.status(403).send("Access denied");
  }
  next();
};

module.exports = { isLoggedIn, isSuperAdmin };
