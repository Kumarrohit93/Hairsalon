const express = require("express");
const router = express.Router();
const {
  createAdminPage,
  createAdmin,
} = require("../controllers/AdminDashboardController");

const { isLoggedIn, isSuperAdmin } = require("../middlewares/auth");

// router.get("/dashboard", isLoggedIn, dashboard);

router.get("/create-admin", isLoggedIn, isSuperAdmin, createAdminPage);
router.post("/create", isLoggedIn, isSuperAdmin, createAdmin);

module.exports = router;
