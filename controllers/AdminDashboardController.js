const adminModel = require("../models/adminLogin.js");
const bcrypt = require("bcrypt");

const createAdminPage = (req, res) => {
  res.render("Admins/CreateAdmin", {
    user: req.session.user,
    page: "Create Admin",
  });
};

const createAdmin = async (req, res) => {
  try {
    const { username, name, phoneNumber, password } = req.body;

    if (!username || !name || !phoneNumber || !password) {
      return res.status(400).send("All fields are required");
    }

    const exists = await adminModel.findOne({ username });
    if (exists) {
      return res.status(409).send("Admin already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await adminModel.create({
      username,
      name,
      phoneNumber,
      password: hashedPassword,
    });

    res.redirect("/admin/create-admin");
  } catch (err) {
    console.error("CREATE ADMIN ERROR:", err);
    res.status(500).send("Server error");
  }
};

module.exports = { createAdminPage, createAdmin };
