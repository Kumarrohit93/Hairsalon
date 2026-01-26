const Service = require("../models/service.js");
const Customer = require("../models/customer");
const {recalcQueue} = require("./AdminLiveQueueController.js")
const crypto = require("crypto");
const getShopSettings = require("../utils/getShopSetting.js")

const homePage = async (req, res) => {
  const services = await Service.find({ active: true });

  const serving = await Customer.find({ status: "serving" });
  const waiting = await Customer.find({ status: "waiting" });
  const setting = await getShopSettings()
  let currentlyServingTokens = serving.map(c => c.tokenNumber);
  let nextFreeTime = null;
  serving.forEach(c => {
    if(!nextFreeTime || new Date(c.estimatedEndTime) < new Date(nextFreeTime)){
      nextFreeTime = c.estimatedEndTime;
    }
  });

  res.render("Customers/home", {
    services,
    currentlyServingTokens,
    nextFreeTime,
    waitingCount: waiting.length,
    setting
  });
};


const bookingPage = async (req, res) => {
  const services = await Service.find({ active: true });
  res.render("Customers/Book", { services });
};

const createBooking = async (req, res) => {
  try {
    const { name, phone, services } = req.body;

    if (!name || !phone || !services || services.length === 0) {
      return res.status(400).send("Missing booking data");
    }

    const serviceIds = Array.isArray(services) ? services : [services];

    const dbServices = await Service.find({ _id: { $in: serviceIds } });

    if (dbServices.length === 0) {
      return res.status(400).send("Invalid services selected");
    }

    let totalAmount = 0;
    let totalEstimatedTime = 0;

    const bookedServices = dbServices.map((s) => {
      totalAmount += s.price;
      totalEstimatedTime += s.duration;

      return {
        serviceId: s._id,
        name: s.name,
        price: s.price,
        duration: s.duration,
      };
    });

    const todayCount = await Customer.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    const tokenNumber = todayCount + 1;
    const publicToken = crypto.randomBytes(8).toString("hex"); 
    

    const customer = await Customer.create({
      name,
      phone,
      services: bookedServices,
      totalAmount,
      totalEstimatedTime,
      type: "booking",
      tokenNumber,
      publicToken,
      status: "waiting",
      checkInTime: new Date(),
    });
    await recalcQueue()

    res.redirect(`/status/${customer.publicToken}`);
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = { homePage, bookingPage, createBooking };
