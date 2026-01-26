const express = require("express");
const router = express.Router();
const { historyPage } = require("../controllers/AdminHistoryController");
const { isLoggedIn } = require("../middlewares/auth");

router.get("/history", isLoggedIn, historyPage);

module.exports = router;
