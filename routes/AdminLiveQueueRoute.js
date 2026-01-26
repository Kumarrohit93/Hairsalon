const express = require("express");
const router = express.Router();
const {
  liveQueuePage,
  startNext,
  completeCustomer,
  addDelay
} = require("../controllers/AdminLiveQueueController.js");

const { isLoggedIn } = require("../middlewares/auth");

router.get("/livequeue", isLoggedIn, liveQueuePage);
router.post("/start-next", isLoggedIn, startNext);
router.post("/complete", isLoggedIn, completeCustomer);
router.post("/delay", isLoggedIn, addDelay);

module.exports = router;
