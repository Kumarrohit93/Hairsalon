const express = require("express");
const router = express.Router();
const { logout } = require("../controllers/AdminLogoutController.js");
const { isLoggedIn } = require("../middlewares/auth.js");

router.get("/logout", isLoggedIn, logout);

module.exports = router;
