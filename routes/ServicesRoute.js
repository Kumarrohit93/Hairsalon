const express = require("express");
const router = express.Router();
const { ServicesPage, CreateServices } = require("../controllers/ServicesController.js");
const { isLoggedIn } = require("../middlewares/auth");

router.get("/servicePage", isLoggedIn, ServicesPage);
router.post("/services/create", CreateServices)
module.exports = router;
