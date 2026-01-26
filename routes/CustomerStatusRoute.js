const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const { statusPage } = require("../controllers/CustomerStatusController");

router.get("/status/:token", statusPage);

router.head("/status/:token", async (req, res) => {
  try {
    const customer = await Customer.findOne({ publicToken: req.params.token });

    if (!customer) return res.sendStatus(404);
    if (customer.status === "completed" || customer.status === "cancelled") {
      return res.sendStatus(404);
    }

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;