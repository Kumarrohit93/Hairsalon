const Service = require("../models/service.js");

const ServicesPage = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    res.render("Admins/Services", {
      services,
      user: req.session.user,
      page: "Services",
    });
  } catch (err) {
    console.log("SERVICE PAGE ERROR:", err);
    res.status(500).send("Server error");
  }
};

const CreateServices = async (req, res) => {
  const { name, duration, price } = req.body;

  if (!name || !duration || !price) {
    return res.status(400).send("All fields are required");
  }

  const data = await Service.create({
    name,
    duration,
    price
  });
// console.log(data)
res.redirect("/admin/servicePage")

};

module.exports = { ServicesPage, CreateServices };
