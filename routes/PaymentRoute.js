const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/PaymentController");
const { verifyPayment } = require("../controllers/PaymentController");

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;
