const express = require("express");
const router = express.Router();
const {editPage, updatePaymentStatus, deleteCustomer} = require("../controllers/AdminEditCustomerPayStatus")

router.get("/customer/:id/edit", editPage)
router.delete("/customer/:id/delete", deleteCustomer)
router.post("/customer/:id/payment", updatePaymentStatus)

module.exports = router
