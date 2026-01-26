const express = require("express");
const router = express.Router();
const allCustomerPage = require("../controllers/AdminAllCustomerController.js");
const { isLoggedIn } = require("../middlewares/auth.js");

router.get("/allcustomers", isLoggedIn, allCustomerPage)

module.exports = router