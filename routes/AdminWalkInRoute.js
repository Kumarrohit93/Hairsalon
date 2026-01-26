const express = require("express");
const router = express.Router();
const {WalkInPage, addWalkinCustomer} = require("../controllers/AdminWalkinController.js")
const { isLoggedIn } = require("../middlewares/auth");

router.get("/addwalkin", isLoggedIn, WalkInPage);
router.post("/walkin", addWalkinCustomer);

module.exports = router