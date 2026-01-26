const adminModel = require("../models/adminLogin.js");
const bcrypt = require("bcrypt");

const loginPage = (req, res) => {
  res.render("Admins/AdminLogin");
};

const superAdminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.SUPER_ADMIN_USERNAME &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    req.session.user = {
      username,
      role: "superadmin",
    };
    return res.redirect("/admin/create-admin");
  }

  const admin = await adminModel.findOne({ username });
  if (!admin) {
    return res.status(401).send("Invalid credentials");
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(401).send("Invalid credentials");
  }

  req.session.user = {
    id: admin._id,
    username: admin.username,
    role: "admin",
  };

  res.redirect("/admin/livequeue");
};

module.exports = { superAdminLogin, loginPage };
