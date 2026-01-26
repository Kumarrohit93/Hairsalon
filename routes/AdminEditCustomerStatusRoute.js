const express = require("express");
const router = express.Router();
const {editPage, updatePaymentStatus} = require("../controllers/AdminEditCustomerPayStatus")

router.get("/customer/:id/edit", editPage)
router.post("/customer/:id/payment", updatePaymentStatus)

module.exports = router