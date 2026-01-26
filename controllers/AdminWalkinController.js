const Customer = require("../models/customer");
const Service = require("../models/service");
const { recalcQueue } = require("./AdminLiveQueueController.js");
const crypto = require("crypto");

const WalkInPage = async (req, res) => {
  const services = await Service.find({ active: true });
  res.render("Admins/AddWalkIn.ejs", {
    user: req.session.user,
    page: "Addwalkin",
    services,
  });
};

const addWalkinCustomer = async (req, res) => {
  const { name, phone, services, paymentMethod } = req.body;

  if (!name || !services || !paymentMethod) {
    return res.send("Missing data");
  }

  let selectedServices = await Service.find({ _id: { $in: services || [] } });

  let totalTime = selectedServices.reduce((a, b) => a + b.duration, 0);
  let totalAmount = selectedServices.reduce((a, b) => a + b.price, 0);

  let last = await Customer.findOne().sort({ tokenNumber: -1 });
  const publicToken = crypto.randomBytes(8).toString("hex");

  await Customer.create({
    name,
    phone,
    services: selectedServices,
    totalEstimatedTime: totalTime,
    totalAmount,
    tokenNumber: last ? last.tokenNumber + 1 : 1,
    publicToken,

    type: "walkin",
    status: "waiting",

    paymentMethod: paymentMethod === "pending" ? null : paymentMethod,
    paymentStatus: paymentMethod === "pending" ? "pending" : "paid",

    checkInTime: new Date(),
  });

  await recalcQueue();
  res.redirect("/admin/livequeue");
};

module.exports = { WalkInPage, addWalkinCustomer };
