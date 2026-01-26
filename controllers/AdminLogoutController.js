const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("LOGOUT ERROR:", err);
      return res.status(500).send("Logout failed");
    }

    res.clearCookie("connect.sid"); 
    res.redirect("/superadmin/loginPage");
  });
};

module.exports = { logout };
