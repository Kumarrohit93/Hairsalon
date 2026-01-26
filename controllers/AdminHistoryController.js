const  Customer  = require("../models/customer");
const setting = require("../models/shopSetting.js")

// helper: start/end of day
function getDateRange(filter) {
  const now = new Date();
  let start, end = new Date();

  if (filter === "today") {
    start = new Date(now.setHours(0,0,0,0));
  } else if (filter === "yesterday") {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    start = new Date(y.setHours(0,0,0,0));
    end = new Date(y.setHours(23,59,59,999));
  } else if (filter === "7days") {
    start = new Date();
    start.setDate(start.getDate() - 7);
  } else {
    start = new Date(0); // all time
  }

  return { start, end };
}

const historyPage = async (req, res) => {
  const filter = req.query.filter || "today";
  const { start, end } = getDateRange(filter);

  const customers = await Customer.find({
    status: { $in: ["completed", "cancelled"] },
    createdAt: { $gte: start, $lte: end }
  }).sort({ createdAt: -1 });

  // summary
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalAmount || 0), 0);

  let serviceMap = {};
  customers.forEach(c => {
    if(c.services){
      c.services.forEach(s => {
        serviceMap[s.name] = (serviceMap[s.name] || 0) + 1;
      });
    }
  });

  let topService = Object.entries(serviceMap).sort((a,b)=>b[1]-a[1])[0];

  res.render("Admins/History.ejs", {
    user: req.session.user,
    page: "History",
    customers,
    filter,
    totalCustomers,
    totalRevenue,
    topService: topService ? topService[0] : "N/A"
  });
};

module.exports = { historyPage };
