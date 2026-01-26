const express = require("express");
const router = express.Router();
const {
  homePage,
  bookingPage,
  createBooking,
} = require("../controllers/CustomerHomeController.js");
const checkShopOpen = require("../middlewares/checkShopOpen");

router.get("/home", homePage);
router.get("/bookPage", checkShopOpen, bookingPage);
router.post("/book", checkShopOpen, createBooking);
module.exports = router;
