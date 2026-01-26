const Customer = require("../models/customer");

const WORKERS = 3;

function formatTime(date) {
  if (!date) return null;
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusPage = async (req, res) => {
  try {
    const { token } = req.params;

    // 1. PUBLIC token se customer
    const customer = await Customer.findOne({ publicToken: token });

    // ❌ Bilkul galat / fake token
    if (!customer) {
      return res.render("Customers/invalidToken");
    }

    // ✅ Agar service complete / cancelled ho chuki
    if (customer.status === "completed" || customer.status === "cancelled") {
      return res.render("Customers/completed", { customer });
    }

    // 2. Currently serving
    const serving = await Customer.find({ status: "serving" }).sort({
      workerNumber: 1,
    });

    // 3. Waiting before this customer
    const waitingBefore = await Customer.find({
      status: "waiting",
      tokenNumber: { $lt: customer.tokenNumber },
    }).sort({ tokenNumber: 1 });

    // 4. Workers end-time map
    let workerEndTimes = {};

    serving.forEach((c) => {
      if (c.workerNumber && c.estimatedEndTime) {
        workerEndTimes[c.workerNumber] = new Date(c.estimatedEndTime);
      }
    });

    // 5. Simulate queue (waiting before)
    for (let cust of waitingBefore) {
      let chosenWorker = null;
      let startTime = null;

      // free worker
      for (let i = 1; i <= WORKERS; i++) {
        if (!workerEndTimes[i]) {
          chosenWorker = i;
          startTime = new Date();
          break;
        }
      }

      // all busy
      if (!chosenWorker) {
        let earliest = Object.entries(workerEndTimes).sort(
          (a, b) => new Date(a[1]) - new Date(b[1]),
        )[0];

        chosenWorker = earliest[0];
        startTime = new Date(earliest[1]);
      }

      let endTime = new Date(
        startTime.getTime() + cust.totalEstimatedTime * 60000,
      );
      workerEndTimes[chosenWorker] = endTime;
    }

    // 6. Ab iss customer ka time
    let chosenWorker = null;
    let startTime = null;

    for (let i = 1; i <= WORKERS; i++) {
      if (!workerEndTimes[i]) {
        chosenWorker = i;
        startTime = new Date();
        break;
      }
    }

    if (!chosenWorker) {
      let earliest = Object.entries(workerEndTimes).sort(
        (a, b) => new Date(a[1]) - new Date(b[1]),
      )[0];

      chosenWorker = earliest[0];
      startTime = new Date(earliest[1]);
    }

    // 7. Render status page
    res.render("Customers/status", {
      customer,
      serving,
      estimatedStartTime: formatTime(startTime),
    });
  } catch (err) {
    console.error("STATUS PAGE ERROR:", err);
    res.status(500).send("Server error");
  }
};

module.exports = { statusPage };
