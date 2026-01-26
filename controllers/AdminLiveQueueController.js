const Customer = require("../models/customer");
const Service = require("../models/service.js")
const WORKERS = 3;

const recalcQueue = async () => {
  console.log("RECALC running")
  const serving = await Customer.find({ status: "serving" }).sort({ workerNumber: 1 });
  const waiting = await Customer.find({ status: "waiting" }).sort({ tokenNumber: 1 });

  let workerEndTimes = {};

  // 1. Pehle serving walon se worker busy mark karo
  serving.forEach(c => {
    workerEndTimes[c.workerNumber] = new Date(c.estimatedEndTime);
  });

  for (let cust of waiting) {

  let chosenWorker = null;
  let startTime = null;

  // 1. free worker check
  for (let i = 1; i <= WORKERS; i++) {
    if (!workerEndTimes[i]) {
      chosenWorker = i;
      startTime = new Date();
      break;
    }
  }

  // 2. agar sab busy
  if (!chosenWorker) {
    let [wid, endTime] = Object.entries(workerEndTimes)
      .sort((a, b) => new Date(a[1]) - new Date(b[1]))[0];

    chosenWorker = Number(wid);
    startTime = new Date(endTime);
  }

  // 3. calculate end
  let endTime = new Date(startTime.getTime() + cust.totalEstimatedTime * 60000);

  // 4. 🔥 MOST IMPORTANT — SAVE IN DB
  cust.workerNumber = chosenWorker;
  cust.estimatedStartTime = startTime;
  cust.estimatedEndTime = endTime;

  await cust.save();   // ←←←← agar ye nahi hai to system fake hai

  // 5. update worker timeline
  workerEndTimes[chosenWorker] = endTime;

  console.log("✅ token", cust.tokenNumber, "→ worker", chosenWorker, "start", startTime);
}
};

const liveQueuePage = async (req, res) => {
  const serving = await Customer.find({ status: "serving" }).sort({ workerNumber: 1 });
  const waiting = await Customer.find({ status: "waiting" }).sort({ tokenNumber: 1 });
  const services = await Service.find({ active: true }); 
  res.render("Admins/LiveQueue", {
    user: req.session.user,
    page: "Live Queue",
    serving,
    waiting,
    services
  });
};

const startNext = async (req, res) => {

  const serving = await Customer.find({ status: "serving" });
  if (serving.length >= WORKERS) return res.redirect("/admin/livequeue");

  const next = await Customer.findOne({ status: "waiting" }).sort({ tokenNumber: 1 });
  if (!next) return res.redirect("/admin/livequeue");

  const used = serving.map(c => c.workerNumber);
  let freeWorker = null;

  for (let i = 1; i <= WORKERS; i++) {
    if (!used.includes(i)) {
      freeWorker = i;
      break;
    }
  }

  next.status = "serving";
  next.workerNumber = freeWorker;
  next.estimatedStartTime = new Date();
  next.estimatedEndTime = new Date(Date.now() + next.totalEstimatedTime * 60000);

  await next.save();
  await recalcQueue();

  res.redirect("/admin/livequeue");
};


const completeCustomer = async (req, res) => {

  const { id } = req.body;
  const cust = await Customer.findById(id);

  if (!cust) return res.redirect("/admin/livequeue");

  cust.status = "completed";
  cust.estimatedEndTime = new Date();
  await cust.save();

  await recalcQueue();
  res.redirect("/admin/livequeue");
};


/* ================= DELAY ================= */

const addDelay = async (req, res) => {
  const { id, minutes } = req.body;

  const cust = await Customer.findById(id);
  if (!cust) return res.redirect("/admin/livequeue");

  cust.delayMinutes += Number(minutes);
  cust.estimatedEndTime = new Date(cust.estimatedEndTime.getTime() + minutes * 60000);

  await cust.save();
  await recalcQueue();

  res.redirect("/admin/livequeue");
};



module.exports = {
  liveQueuePage,
  startNext,
  completeCustomer,
  addDelay,
  recalcQueue
};
