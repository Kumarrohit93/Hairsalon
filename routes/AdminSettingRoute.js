const express = require("express")
const router = express.Router();
const {settingsPage, updateShopStatus} = require("../controllers/AdminSettingController.js")
const {isLoggedIn} = require("../middlewares/auth.js")
router.get("/settings", isLoggedIn, settingsPage);
router.post("/settings", isLoggedIn, updateShopStatus);


module.exports = router;